document.addEventListener('DOMContentLoaded', () => {
    // 1. Elementos del DOM
    const btnAbrirModal = document.getElementById('btnAbrirConsulta');
    const btnCerrarModal = document.getElementById('btnCerrarConsulta');
    const modal = document.getElementById('modal-consulta');
    
    const inputTelefono = document.getElementById('consulta-telefono');
    const selectRuta = document.getElementById('consulta-ruta');
    const btnBuscar = document.getElementById('buscar-registro-btn');
    
    const contenedorError = document.getElementById('consulta-error');
    const mensajeError = document.getElementById('consulta-error-message');
    const contenedorLoading = document.getElementById('consulta-loading');
    const contenedorResultados = document.getElementById('consulta-resultados');
    const textoTotal = document.getElementById('consulta-total');
    const listaResultados = document.getElementById('consulta-lista');

    // 2. Control de Apertura y Cierre
    const abrirModal = () => {
        modal.classList.remove('hidden');
        document.body.classList.add('overflow-hidden'); // Evita el scroll del fondo
    };

    const cerrarModal = () => {
        modal.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
        limpiarModal();
    };

    btnAbrirModal?.addEventListener('click', abrirModal);
    btnCerrarModal?.addEventListener('click', cerrarModal);

    // Cerrar al hacer clic fuera del contenedor modal
    modal?.addEventListener('click', (e) => {
        if (e.target === modal) cerrarModal();
    });

    // Cerrar con la tecla Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            cerrarModal();
        }
    });

    // 3. Reset del estado del Modal
    function limpiarModal() {
        if (inputTelefono) inputTelefono.value = '';
        if (selectRuta) selectRuta.selectedIndex = 0;
        ocultarRespuestas();
    }

    function ocultarRespuestas() {
        contenedorError?.classList.add('hidden');
        contenedorLoading?.classList.add('hidden');
        contenedorResultados?.classList.add('hidden');
        if (listaResultados) listaResultados.innerHTML = '';
    }

    // 4. Lógica de Búsqueda
    btnBuscar?.addEventListener('click', async () => {
        const telefono = inputTelefono?.value.trim();
        const ruta = selectRuta?.value;

        if (!telefono || telefono.length !== 4) {
            mostrarError('Por favor ingresa exactamente los 4 últimos dígitos.');
            return;
        }

        if (!ruta) {
            mostrarError('Por favor selecciona tu categoría / ruta.');
            return;
        }

        ocultarRespuestas();
        contenedorLoading?.classList.remove('hidden');

        try {
            // Reemplaza la URL por tu endpoint real (GAS, ORDS, etc.)
            const response = await fetch(`https://script.google.com/macros/s/AKfycbzp5JTZ2Odv_LXExz7RUYL-Wf2r2fwpVHvjSdB7vcF1G_uw3jJPgq2YE9aFtqrh7q9Y/exec?ultimos4=${telefono}&ruta=${encodeURIComponent(ruta)}`);
            const data = await response.json();

            contenedorLoading?.classList.add('hidden');

            // Validación de la respuesta JSON recibida
            if (data.result === "success" && data.registros && data.registros.length > 0) {
                mostrarResultados(data.registros, data.total);
            } else {
                mostrarError('No se encontró ningún registro con los datos ingresados.');
            }

        } catch (error) {
            contenedorLoading?.classList.add('hidden');
            mostrarError('Ocurrió un error al consultar. Inténtalo más tarde.');
        }
    });

    // 5. Renderizado de Respuestas
    function mostrarError(mensaje) {
        if (mensajeError) mensajeError.textContent = mensaje;
        contenedorError?.classList.remove('hidden');
    }

    function mostrarResultados(registros, total) {
        if (textoTotal) {
            textoTotal.textContent = `${total} registro(s) encontrado(s)`;
        }
        
        listaResultados.innerHTML = registros.map(item => `
            <div class="bg-black border border-zinc-800 p-4 rounded-xl flex items-center justify-between">
                <div>
                    <p class="text-white font-bold text-base capitalize">${item.nombre}</p>
                    <p class="text-xs text-zinc-400 mt-0.5">${item.equipo}</p>
                </div>
                <div class="text-right">
                    <span class="text-xs text-zinc-500 uppercase font-bold block">Folio</span>
                    <span class="text-xl font-black text-yellow-400">#${String(item.registro).padStart(3, '0')}</span>
                </div>
            </div>
        `).join('');

        contenedorResultados?.classList.remove('hidden');
    }
});