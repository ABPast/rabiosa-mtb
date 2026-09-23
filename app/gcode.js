const SHEET_NAME = 'Registros';
/*
 * ============================================================
 * CONFIGURACIÓN DE SEGURIDAD
 * ============================================================
 */
// Máximo de caracteres permitidos por campo
const LIMITES = {
  nombre: 100,
  edad: 3,
  procedencia: 100,
  equipo: 100,
  ruta: 30,
  telefono: 20,
  emergencia: 150
};
// Tiempo durante el cual se considera sospechosa
// una cantidad excesiva de peticiones.
const VENTANA_SEGURIDAD_SEGUNDOS = 60;
// Máximo de registros permitidos durante la ventana.
// Esto es una protección general, NO por persona.
const MAX_REGISTROS_VENTANA = 30;
// ============================================================
// NUEVO: MÁXIMO DE REGISTROS POR TELÉFONO
// ============================================================
const MAX_REGISTROS_POR_TELEFONO = 1;
/*
 * ============================================================
 * POST PRINCIPAL
 * ============================================================
 */
function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    /*
     * ========================================================
     * VALIDAR PETICIÓN
     * ========================================================
     */
    if (!e || !e.parameter) {
      throw new Error('Solicitud inválida.');
    }
    const data = e.parameter;
    /*
     * ========================================================
     * ANTI-BOT - HONEYPOT
     * ========================================================
     *
     * Los usuarios normales nunca deben llenar "website".
     * Si contiene información, consideramos la petición
     * sospechosa y la rechazamos.
     */
    if (
      data.website &&
      String(data.website).trim() !== ''
    ) {
      throw new Error(
        'Solicitud no válida.'
      );
    }
    /*
     * ========================================================
     * CONTROL GENERAL DE PETICIONES
     * ========================================================
     *
     * Evita que alguien intente enviar cientos o miles
     * de solicitudes en poco tiempo.
     *
     * IMPORTANTE:
     * No limita por persona.
     * Una persona puede registrar a varios ciclistas.
     */
    verificarLimiteSolicitudes();
    /*
     * ========================================================
     * OBTENER HOJA
     * ========================================================
     */
    const spreadsheet =
      SpreadsheetApp.getActiveSpreadsheet();
    const sheet =
      spreadsheet.getSheetByName(SHEET_NAME);
    if (!sheet) {
      throw new Error(
        'No existe la hoja "' +
        SHEET_NAME +
        '".'
      );
    }
    /*
     * ========================================================
     * VALIDACIONES
     * ========================================================
     */
    validarDatos(data);
    /*
     * ========================================================
     * BLOQUEO
     * ========================================================
     *
     * Evita que dos peticiones simultáneas obtengan
     * el mismo número de registro.
     *
     * También es importante para el límite de registros
     * por teléfono.
     */
    lock.waitLock(30000);
    /*
     * ========================================================
     * NUEVO:
     * VERIFICAR LÍMITE POR TELÉFONO
     * ========================================================
     *
     * Esta validación se realiza DESPUÉS de obtener el LOCK.
     *
     * Esto es importante para evitar que dos peticiones
     * simultáneas puedan saltarse el límite.
     */
    verificarLimiteTelefono(
      sheet,
      data.telefono
    );
    /*
     * ========================================================
     * OBTENER ÚLTIMO REGISTRO
     * ========================================================
     */
    const lastRow =
      sheet.getLastRow();
    let ultimoRegistro = 0;
    if (lastRow > 1) {
      const registros =
        sheet
          .getRange(
            2,
            1,
            lastRow - 1,
            1
          )
          .getValues();
      for (
        let i = 0;
        i < registros.length;
        i++
      ) {
        const valor =
          registros[i][0];
        if (
          valor !== '' &&
          !isNaN(valor)
        ) {
          ultimoRegistro =
            Math.max(
              ultimoRegistro,
              Number(valor)
            );
        }
      }
    }
    /*
     * ========================================================
     * GENERAR FOLIO
     * ========================================================
     */
    const nuevoRegistro =
      ultimoRegistro + 1;
    /*
     * ========================================================
     * GUARDAR
     * ========================================================
     */
    sheet.appendRow([
      nuevoRegistro,
      new Date(),
      limpiarTexto(
        data.nombre
      ),
      limpiarTexto(
        data.edad
      ),
      limpiarTexto(
        data.procedencia
      ),
      limpiarTexto(
        data.equipo
      ),
      limpiarTexto(
        data.ruta
      ),
      limpiarTexto(
        data.telefono
      ),
      limpiarTexto(
        data.emergencia
      )
    ]);
    /*
     * ========================================================
     * RESPUESTA
     * ========================================================
     */
    return respuestaJSON({
      result: 'success',
      registro:
        nuevoRegistro
    });
  } catch (error) {
    console.error(
      'Error en doPost:',
      error
    );
    return respuestaJSON({
      result: 'error',
      error:
        error.message ||
        'Solicitud no válida.'
    });
  } finally {
    try {
      lock.releaseLock();
    } catch (error) {
      // No hacer nada
    }
  }
}
/*
 * ============================================================
 * VALIDACIÓN DE DATOS
 * ============================================================
 */
function validarDatos(data) {
  /*
   * NOMBRE
   */
  if (
    !data.nombre ||
    !data.nombre.trim()
  ) {
    throw new Error(
      'El nombre es obligatorio.'
    );
  }
  if (
    data.nombre.length >
    LIMITES.nombre
  ) {
    throw new Error(
      'El nombre es demasiado largo.'
    );
  }
  /*
   * EDAD
   */
  if (
    !data.edad ||
    data.edad.trim() === ''
  ) {
    throw new Error(
      'La edad es obligatoria.'
    );
  }
  const edad =
    Number(data.edad);
  if (
    !Number.isInteger(edad) ||
    edad < 1 ||
    edad > 100
  ) {
    throw new Error(
      'La edad no es válida.'
    );
  }
  /*
   * PROCEDENCIA
   */
  if (
    data.procedencia &&
    data.procedencia.length >
    LIMITES.procedencia
  ) {
    throw new Error(
      'La procedencia es demasiado larga.'
    );
  }
  /*
   * EQUIPO
   */
  if (
    data.equipo &&
    data.equipo.length >
    LIMITES.equipo
  ) {
    throw new Error(
      'El nombre del equipo es demasiado largo.'
    );
  }
  /*
   * RUTA
   */
  const rutasPermitidas = [
    'Principiantes aferrados',
    'Intermedios / Avanzados'
  ];
  if (
    !data.ruta ||
    !rutasPermitidas.includes(
      data.ruta
    )
  ) {
    throw new Error(
      'La ruta seleccionada no es válida.'
    );
  }
  /*
   * TELÉFONO
   */
  if (
    !data.telefono ||
    data.telefono.trim() === ''
  ) {
    throw new Error(
      'El teléfono es obligatorio.'
    );
  }
  if (
    data.telefono.length >
    LIMITES.telefono
  ) {
    throw new Error(
      'El teléfono es demasiado largo.'
    );
  }
  const telefono =
    data.telefono.replace(
      /\D/g,
      ''
    );
  if (
    telefono.length < 10 ||
    telefono.length > 15
  ) {
    throw new Error(
      'El teléfono no es válido.'
    );
  }
  /*
   * CONTACTO DE EMERGENCIA
   */
  if (
    !data.emergencia ||
    !data.emergencia.trim()
  ) {
    throw new Error(
      'El contacto de emergencia es obligatorio.'
    );
  }
  if (
    data.emergencia.length >
    LIMITES.emergencia
  ) {
    throw new Error(
      'El contacto de emergencia es demasiado largo.'
    );
  }
  /*
   * PRIVACIDAD
   */
  if (
    data.privacidad !==
    'Aceptado'
  ) {
    throw new Error(
      'Debes aceptar el uso de datos para logística y seguridad.'
    );
  }
}
/*
 * ============================================================
 * NUEVO:
 * LÍMITE DE REGISTROS POR TELÉFONO
 * ============================================================
 *
 * Permite máximo:
 *
 *       2 registros
 *
 * con el mismo número telefónico.
 *
 * Ejemplo:
 *
 * 2461234567 -> registro 1  ✅
 * 2461234567 -> registro 2  ✅
 * 2461234567 -> registro 3  ❌
 *
 * La comparación ignora:
 *
 * espacios
 * guiones
 * paréntesis
 * +
 * cualquier otro carácter que no sea número.
 *
 * Por ejemplo:
 *
 * +52 246-123-4567
 *
 * y
 *
 * 2461234567
 *
 * se consideran el mismo número
 * después de eliminar caracteres no numéricos.
 */
function verificarLimiteTelefono(
  sheet,
  telefono
) {
  const telefonoBuscado =
    String(telefono || '')
      .replace(/\D/g, '');
  /*
   * Si por alguna razón no hay teléfono,
   * dejamos que validarDatos() se encargue.
   */
  if (!telefonoBuscado) {
    return;
  }
  /*
   * Si solamente existe la fila de encabezados,
   * todavía no hay registros.
   */
  const lastRow =
    sheet.getLastRow();
  if (lastRow <= 1) {
    return;
  }
  /*
   * La columna 8 corresponde a:
   *
   * 1 = Registro
   * 2 = Fecha
   * 3 = Nombre
   * 4 = Edad
   * 5 = Procedencia
   * 6 = Equipo
   * 7 = Ruta
   * 8 = Teléfono
   * 9 = Emergencia
   */
  const telefonos =
    sheet
      .getRange(
        2,
        8,
        lastRow - 1,
        1
      )
      .getValues();
  let coincidencias = 0;
  /*
   * Revisamos todos los teléfonos
   * existentes en la hoja.
   */
  for (
    let i = 0;
    i < telefonos.length;
    i++
  ) {
    const telefonoRegistro =
      String(
        telefonos[i][0] || ''
      )
      .replace(/\D/g, '');
    if (
      telefonoRegistro &&
      telefonoRegistro === telefonoBuscado
    ) {
      coincidencias++;
    }
    /*
     * Si ya encontramos 2 registros,
     * no permitimos un tercero.
     */
    if (
      coincidencias >=
      MAX_REGISTROS_POR_TELEFONO
    ) {
      throw new Error(
        'Este número de teléfono ya tiene ' +
        MAX_REGISTROS_POR_TELEFONO +
        ' registros. Consulta tu registro. '
      );
    }
  }
}
/*
 * ============================================================
 * CONTROL DE PETICIONES
 * ============================================================
 */
function verificarLimiteSolicitudes() {
  const cache =
    CacheService.getScriptCache();
  const clave =
    'registro_global';
  const actual =
    cache.get(clave);
  let contador =
    actual
      ? Number(actual)
      : 0;
  contador++;
  /*
   * Si se supera el límite,
   * rechazamos temporalmente.
   */
  if (
    contador >
    MAX_REGISTROS_VENTANA
  ) {
    throw new Error(
      'Se alcanzó temporalmente el límite de registros. Intenta nuevamente en unos minutos.'
    );
  }
  cache.put(
    clave,
    String(contador),
    VENTANA_SEGURIDAD_SEGUNDOS
  );
}
/*
 * ============================================================
 * LIMPIAR TEXTO
 * ============================================================
 */
function limpiarTexto(valor) {
  if (
    valor === null ||
    valor === undefined
  ) {
    return '';
  }
  return String(valor)
    .trim();
}
/*
 * ============================================================
 * RESPUESTA JSON
 * ============================================================
 */
function respuestaJSON(datos) {
  return ContentService
    .createTextOutput(
      JSON.stringify(datos)
    )
    .setMimeType(
      ContentService.MimeType.JSON
    );
}
/*
 * ============================================================
 * PRUEBA MANUAL
 * ============================================================
 */
function pruebaDoPost() {
  const datosPrueba = {
    parameter: {
      nombre:
        'Juan Pérez Prueba',
      edad:
        '33',
      procedencia:
        'Ixtacuixtla, Tlaxcala',
      equipo:
        "MTB Pug's",
      ruta:
        'Intermedios / Avanzados',
      telefono:
        '2460000000',
      emergencia:
        'María Pérez - 2461112233',
      privacidad:
        'Aceptado',
      website:
        ''
    }
  };
  const respuesta =
    doPost(datosPrueba);
  Logger.log(
    respuesta.getContent()
  );
}
/*
 * ============================================================
 * ENMASCARAR NOMBRE PARA CONSULTA
 * ============================================================
 *
 * Regla:
 *
 * Primera palabra:
 *   Se muestra completa.
 *
 * Palabras posteriores:
 *   Se muestran únicamente las primeras 2 letras
 *   y el resto se reemplaza por "*".
 *
 * Ejemplo:
 *
 * EDGAR RIOS MENDEZ
 *
 * Resultado:
 *
 * EDGAR RI** MEN***
 */
function enmascararNombre(nombre) {
  const partes =
    String(nombre || '')
      .trim()
      .split(/\s+/)
      .filter(Boolean);
  if (
    partes.length === 0
  ) {
    return '';
  }
  // El primer dato se muestra completo
  const nombrePrincipal =
    partes[0];
  // Los datos posteriores se enmascaran
  const resto =
    partes
      .slice(1)
      .map(function(parte) {
        if (
          parte.length <= 2
        ) {
          return parte;
        }
        return (
          parte.substring(0, 2) +
          '*'.repeat(
            parte.length - 2
          )
        );
      });
  return [
    nombrePrincipal
  ]
    .concat(resto)
    .join(' ');
}
/* ============================================================
   PATROCINADORES
   ============================================================ */

const SPONSORS_SHEET_NAME = 'Patrocinadores';


/**
 * Obtiene los patrocinadores activos.
 *
 * Columnas esperadas:
 *
 * A = activo
 * B = nombre
 * C = logo
 * D = enlace
 * E = orden
 */
function obtenerPatrocinadores() {

  const spreadsheet =
    SpreadsheetApp.getActiveSpreadsheet();

  const sheet =
    spreadsheet.getSheetByName(
      SPONSORS_SHEET_NAME
    );

  if (!sheet) {

    throw new Error(
      'No existe la hoja "' +
      SPONSORS_SHEET_NAME +
      '".'
    );

  }

  const lastRow =
    sheet.getLastRow();

  if (lastRow <= 1) {
    return [];
  }

  const datos =
    sheet
      .getRange(
        2,
        1,
        lastRow - 1,
        5
      )
      .getValues();

  const patrocinadores = [];

  for (
    let i = 0;
    i < datos.length;
    i++
  ) {

    const activo =
      String(
        datos[i][0] || ''
      )
      .trim()
      .toUpperCase();

    if (activo !== 'SI') {
      continue;
    }

    const nombre =
      String(
        datos[i][1] || ''
      )
      .trim();

    const logo =
      String(
        datos[i][2] || ''
      )
      .trim();

    const enlace =
      String(
        datos[i][3] || ''
      )
      .trim();

    const orden =
      Number(
        datos[i][4]
      ) || 9999;

    /*
     * No mostramos registros incompletos.
     */
    if (!nombre || !logo) {
      continue;
    }

    patrocinadores.push({
      nombre: nombre,
      logo: logo,
      enlace: enlace,
      orden: orden
    });
  }

  /*
   * Ordenar por columna "orden".
   */
  patrocinadores.sort(
    (a, b) =>
      a.orden - b.orden
  );

  return patrocinadores;
}
/*
 * ============================================================
 * GET - CONSULTAR REGISTROS
 * ============================================================
 *
 * Busca TODOS los registros que coincidan con:
 *
 *   1. Últimos 4 dígitos del teléfono
 *   2. Categoría / ruta
 *
 * Parámetros esperados:
 *
 *   ?ultimos4=4721
 *   &ruta=Principiantes%20aferrados
 *
 * La respuesta puede contener uno o varios registros.
 */
function doGet(e) {
  try {
    /*
     * ========================================================
     * VALIDAR PETICIÓN
     * ========================================================
     */
    if (
      !e ||
      !e.parameter
    ) {
      return respuestaJSON({
        result: 'error',
        error:
          'Solicitud inválida.'
      });
    }
        /* ========================================================
       CONSULTA DE PATROCINADORES
       ======================================================== */

    if (
      String(
        e.parameter.sponsors || ''
      ).trim() === '1'
    ) {

      try {

        const patrocinadores =
          obtenerPatrocinadores();

        return respuestaJSON({
          result: 'success',
          patrocinadores:
            patrocinadores
        });

      } catch (error) {

        return respuestaJSON({
          result: 'error',
          error:
            error.message ||
            'No fue posible cargar los patrocinadores.'
        });

      }
    }
    /*
     * ========================================================
     * OBTENER PARÁMETROS
     * ========================================================
     */
    const ultimos4 =
      String(
        e.parameter.ultimos4 || ''
      )
      .replace(/\D/g, '');
    const ruta =
      String(
        e.parameter.ruta || ''
      )
      .trim();
    /*
     * ========================================================
     * VALIDAR ÚLTIMOS 4 DÍGITOS
     * ========================================================
     */
    if (
      ultimos4.length !== 4
    ) {
      return respuestaJSON({
        result: 'error',
        error:
          'Debes ingresar exactamente los últimos 4 dígitos de tu celular.'
      });
    }
    /*
     * ========================================================
     * VALIDAR RUTA / CATEGORÍA
     * ========================================================
     */
    const rutasPermitidas = [
      'Principiantes aferrados',
      'Intermedios / Avanzados'
    ];
    if (
      !rutasPermitidas.includes(
        ruta
      )
    ) {
      return respuestaJSON({
        result: 'error',
        error:
          'La categoría seleccionada no es válida.'
      });
    }
    /*
     * ========================================================
     * OBTENER HOJA
     * ========================================================
     */
    const spreadsheet =
      SpreadsheetApp.getActiveSpreadsheet();
    const sheet =
      spreadsheet.getSheetByName(
        SHEET_NAME
      );
    if (!sheet) {
      return respuestaJSON({
        result: 'error',
        error:
          'No existe la hoja "' +
          SHEET_NAME +
          '".'
      });
    }
    /*
     * ========================================================
     * VERIFICAR SI EXISTEN REGISTROS
     * ========================================================
     */
    const lastRow =
      sheet.getLastRow();
    if (
      lastRow <= 1
    ) {
      return respuestaJSON({
        result: 'not_found',
        registros: []
      });
    }
    /*
     * ========================================================
     * OBTENER DATOS
     * ========================================================
     *
     * Estructura actual de la hoja:
     *
     * 1  Registro
     * 2  Fecha
     * 3  Nombre
     * 4  Edad
     * 5  Procedencia
     * 6  Equipo
     * 7  Ruta
     * 8  Teléfono
     * 9  Emergencia
     */
    const datos =
      sheet
        .getRange(
          2,
          1,
          lastRow - 1,
          9
        )
        .getValues();
    /*
     * ========================================================
     * ARRAY DE RESULTADOS
     * ========================================================
     */
    const resultados = [];
    /*
     * ========================================================
     * RECORRER TODOS LOS REGISTROS
     * ========================================================
     */
    for (
      let i = 0;
      i < datos.length;
      i++
    ) {
      /*
       * DATOS DEL REGISTRO
       */
      const registro =
        datos[i][0];
      const nombre =
        String(
          datos[i][2] || ''
        ).trim();
      const rutaRegistro =
        String(
          datos[i][6] || ''
        ).trim();
      const equipo =
        String(
          datos[i][5] || ''
        ).trim();
      const telefonoRegistro =
        String(
          datos[i][7] || ''
        )
        .replace(/\D/g, '');
      /*
       * OBTENER ÚLTIMOS 4 DEL TELÉFONO
       */
      const ultimos4Registro =
        telefonoRegistro.slice(-4);
      /*
       * COMPARAR TELÉFONO + CATEGORÍA
       */
      if (
        ultimos4Registro ===
          ultimos4 &&
        rutaRegistro ===
          ruta
      ) {
        /*
         * Agregamos el registro al array.
         *
         * NO hacemos "return" aquí.
         *
         * Esto permite continuar recorriendo
         * la hoja y encontrar otros registros
         * con el mismo teléfono y categoría.
         */
        resultados.push({
          registro:
            registro,
          nombre:
            enmascararNombre(
              nombre
            ),
          equipo:
            equipo
        });
      }
    }
    /*
     * ========================================================
     * DEVOLVER RESULTADOS
     * ========================================================
     */
    if (
      resultados.length > 0
    ) {
      return respuestaJSON({
        result: 'success',
        total:
          resultados.length,
        registros:
          resultados
      });
    }
    /*
     * ========================================================
     * NINGUNA COINCIDENCIA
     * ========================================================
     */
    return respuestaJSON({
      result: 'not_found',
      total: 0,
      registros: []
    });
  } catch (error) {
    /*
     * ========================================================
     * ERROR
     * ========================================================
     */
    console.error(
      'Error en doGet:',
      error
    );
    return respuestaJSON({
      result: 'error',
      error:
        error.message ||
        'No fue posible realizar la consulta.'
    });
  }
}
/*
 * ============================================================
 * PRUEBA MANUAL DE DOGET
 * ============================================================
 */
function pruebaDoGet() {
  // Simulamos la petición que llegaría desde la página
  const e = {
    parameter: {
      ultimos4:
        '0000',
      //ruta:
      //  'Principiantes aferrados'
      ruta:
        'Intermedios / Avanzados'
    }
  };
  // Ejecutamos exactamente el doGet()
  const respuesta =
    doGet(e);
  // Mostrar la respuesta en el registro
  console.log(
    respuesta.getContent()
  );
}