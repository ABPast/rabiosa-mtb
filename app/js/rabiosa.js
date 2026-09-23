/* ============================================================
   MTB PUG'S - RODADA "LA RABIOSA"
   Controlador principal
   ============================================================ */
class RabiosaApp {
    constructor() {
        /*
         * =====================================================
         * CONFIGURACIÓN
         * =====================================================
         */
        this.CONFIG = {
            /*
             * URL de Google Apps Script
             */
            scriptURL:
                'https://script.google.com/macros/s/AKfycbzp5JTZ2Odv_LXExz7RUYL-Wf2r2fwpVHvjSdB7vcF1G_uw3jJPgq2YE9aFtqrh7q9Y/exec',
                //'https://script.google.com/macros/s/AKfycbzmaGm1b3lPhTSBjeS-tpHgjIfPEtQzylDAA-N5-6yDVp_-xYSV-2ebG1veVvXmt79ydg/exec',
            /*
             * Fecha del evento
             */
            eventDate:
                '2026-11-22T08:00:00-06:00',
            /*
             * Rutas de Strava.
             *
             */
            stravaShort: '',
            stravaLong: '',
            // Formato: 521XXXXXXXXXX, sin +, espacios ni guiones.
            whatsapp: '5212481231457',
            groupWhats: 'https://chat.whatsapp.com/H8IElKhyw4856ftBU64BWF',
            urlPage: 'https://mtb-pugs.sportiqs.com.mx',
        };

        window.RABIOSA_CONFIG = this.CONFIG;
        /*
         * =====================================================
         * VARIABLES
         * =====================================================
         */
        this.registro = null;
        this.toastTimeout = null;
        this.isSubmitting = false;
        /*
         * =====================================================
         * INICIAR
         * =====================================================
         */
        this.cacheElements();
        this.init();
    }
    /* =========================================================
       ELEMENTOS DEL DOM
       ========================================================= */
    cacheElements() {
        this.form =
            document.getElementById('registro-form');
        this.submitBtn =
            document.getElementById('submit-btn');
        this.successBanner =
            document.getElementById(
                'form-success-banner'
            );
        this.errorBox =
            document.getElementById(
                'form-error'
            );
        this.errorMessage =
            document.getElementById(
                'form-error-message'
            );
        this.resetFormBtn =
            document.getElementById(
                'reset-form-btn'
            );
        this.shareBtn =
            document.getElementById(
                'share-registration-btn'
            );
        this.folioElement =
            document.getElementById(
                'confirmation-folio'
            );
        this.menuBtn =
            document.getElementById(
                'menu-btn'
            );
        this.mobileMenu =
            document.getElementById(
                'mobile-menu'
            );
        this.menuIcon =
            document.getElementById(
                'menu-icon'
            );
        this.shortStrava =
            document.getElementById(
                'strava-short-link'
            );
        this.longStrava =
            document.getElementById(
                'strava-long-link'
            );
        this.whatsappLink =
            document.getElementById(
                'whatsapp-link'
            );
        this.toast =
            document.getElementById(
                'toast'
            );
        this.toastMessage =
            document.getElementById(
                'toast-message'
            );
        this.toastIcon =
            document.getElementById(
                'toast-icon'
            );
        this.days =
            document.getElementById(
                'days'
            );
        this.hours =
            document.getElementById(
                'hours'
            );
        this.minutes =
            document.getElementById(
                'minutes'
            );
        this.seconds =
            document.getElementById(
                'seconds'
            );
        this.whatsappGroup =
            document.getElementById(
                'whatsapp-group'
            );
    }
    /* =========================================================
       INICIALIZACIÓN
       ========================================================= */
    init() {
        this.initMobileMenu();
        this.initCountdown();
        this.initFaq();
        this.initStrava();
        this.initWhatsApp();
        this.initSecurityToken();
        this.initForm();
    }
    /* =========================================================
       MENÚ MÓVIL
       ========================================================= */
    initMobileMenu() {
        if (!this.menuBtn || !this.mobileMenu) {
            return;
        }
        this.menuBtn.addEventListener(
            'click',
            () => {
                const isHidden =
                    this.mobileMenu.classList
                        .contains('hidden');
                this.mobileMenu.classList
                    .toggle('hidden');
                this.menuBtn.setAttribute(
                    'aria-expanded',
                    String(isHidden)
                );
                if (this.menuIcon) {
                    this.menuIcon.className =
                        isHidden
                            ? 'fa-solid fa-xmark'
                            : 'fa-solid fa-bars';
                }
            }
        );
        document
            .querySelectorAll('.mobile-link')
            .forEach(link => {
                link.addEventListener(
                    'click',
                    () => {
                        this.closeMobileMenu();
                    }
                );
            });
    }
    closeMobileMenu() {
        if (!this.mobileMenu) {
            return;
        }
        this.mobileMenu.classList
            .add('hidden');
        if (this.menuBtn) {
            this.menuBtn.setAttribute(
                'aria-expanded',
                'false'
            );
        }
        if (this.menuIcon) {
            this.menuIcon.className =
                'fa-solid fa-bars';
        }
    }
    /* =========================================================
       CUENTA REGRESIVA
       ========================================================= */
    initCountdown() {
        this.updateCountdown();
        setInterval(
            () => {
                this.updateCountdown();
            },
            1000
        );
    }
    updateCountdown() {
        if (!this.days) {
            return;
        }
        const eventDate =
            new Date(
                this.CONFIG.eventDate
            ).getTime();
        const now =
            Date.now();
        const difference =
            eventDate - now;
        /*
         * El evento ya comenzó.
         */
        if (difference <= 0) {
            this.days.textContent =
                '00';
            this.hours.textContent =
                '00';
            this.minutes.textContent =
                '00';
            this.seconds.textContent =
                '00';
            return;
        }
        const days =
            Math.floor(
                difference /
                (1000 * 60 * 60 * 24)
            );
        const hours =
            Math.floor(
                (difference %
                    (1000 * 60 * 60 * 24)) /
                (1000 * 60 * 60)
            );
        const minutes =
            Math.floor(
                (difference %
                    (1000 * 60 * 60)) /
                (1000 * 60)
            );
        const seconds =
            Math.floor(
                (difference %
                    (1000 * 60)) /
                1000
            );
        this.days.textContent =
            String(days)
                .padStart(2, '0');
        this.hours.textContent =
            String(hours)
                .padStart(2, '0');
        this.minutes.textContent =
            String(minutes)
                .padStart(2, '0');
        this.seconds.textContent =
            String(seconds)
                .padStart(2, '0');
    }
    /* =========================================================
       FAQ
       ========================================================= */
    initFaq() {
        document
            .querySelectorAll('.faq-button')
            .forEach(button => {
                button.addEventListener(
                    'click',
                    () => {
                        const item =
                            button.closest(
                                '.faq-item'
                            );
                        if (!item) {
                            return;
                        }
                        const wasActive =
                            item.classList
                                .contains('active');
                        document
                            .querySelectorAll(
                                '.faq-item'
                            )
                            .forEach(
                                otherItem => {
                                    otherItem.classList
                                        .remove(
                                            'active'
                                        );
                                }
                            );
                        if (!wasActive) {
                            item.classList
                                .add('active');
                        }
                    }
                );
            });
    }
    /* =========================================================
       STRAVA
       ========================================================= */
    initStrava() {
        this.configureStravaLink(
            this.shortStrava,
            this.CONFIG.stravaShort
        );
        this.configureStravaLink(
            this.longStrava,
            this.CONFIG.stravaLong
        );
    }
    configureStravaLink(
        element,
        url
    ) {
        if (!element) {
            return;
        }
        /*
         * Si todavía no existe una ruta,
         * mostramos "próximamente".
         */
        if (!url) {
            element.removeAttribute(
                'href'
            );
            element.classList.add(
                'opacity-60',
                'cursor-not-allowed'
            );
            element.innerHTML =
                '<i class="fa-solid fa-clock mr-2"></i> Ruta próximamente';
            return;
        }
        element.href = url;
    }
    /* =========================================================
       WHATSAPP
       ========================================================= */
    initWhatsApp() {
        /*
         * Esta función queda preparada,
         * pero no se utiliza actualmente.
         */
        if (
            !this.whatsappLink ||
            !this.CONFIG.whatsapp || !this.whatsappGroup ||
            !this.CONFIG.groupWhats
        ) {
            return;
        }
        const message =
            'Hola MTB PUG\'S, tengo una duda sobre la Rodada La Rabiosa.';
        this.whatsappLink.href =
            `https://wa.me/${this.CONFIG.whatsapp}?text=${encodeURIComponent(message)}`;
        this.whatsappLink.classList
            .remove('hidden');
        this.whatsappGroup.href =
            this.CONFIG.groupWhats;
    }
    /* =========================================================
       TOAST
       ========================================================= */
    showToast(
        message,
        type = 'success'
    ) {
        if (!this.toast) {
            return;
        }
        this.toastMessage.textContent =
            message;
        this.toastIcon.className =
            type === 'error'
                ? 'fa-solid fa-circle-exclamation text-red-400 text-xl'
                : 'fa-solid fa-circle-check text-yellow-400 text-xl';
        this.toast.classList
            .add('show');
        clearTimeout(
            this.toastTimeout
        );
        this.toastTimeout =
            setTimeout(
                () => {
                    this.toast.classList
                        .remove('show');
                },
                4000
            );
    }
    /* =========================================================
       FORMULARIO - VALIDACIÓN
       ========================================================= */
    validateForm() {
        const nombre =
            document.getElementById(
                'nombre'
            );
        const edad =
            document.getElementById(
                'edad'
            );
        const telefono =
            document.getElementById(
                'telefono'
            );
        const ruta =
            document.getElementById(
                'ruta-select'
            );
        const emergencia_name =
            document.getElementById(
                'emergencia_name'
            );
        const emergencia_number =
            document.getElementById(
                'emergencia_number'
            );
        const privacidad =
            document.getElementById(
                'privacidad'
            );
        /*
         * NOMBRE
         */
        if (
            !nombre ||
            !nombre.value.trim()
        ) {
            nombre.focus();
            this.showToast(
                'Ingresa tu nombre completo.',
                'error'
            );
            return false;
        }
        /*
         * EDAD
         */
        const age =
            Number(
                edad.value
            );
        if (
            !age ||
            age < 1 ||
            age > 100
        ) {
            edad.focus();
            this.showToast(
                'La edad debe estar entre 1 y 100 años.',
                'error'
            );
            return false;
        }
        /*
         * RUTA
         */
        if (
            !ruta.value.trim()
        ){
            ruta.focus();
            this.showToast(
                'Selecciona una ruta.',
                'error'
            );
            return false;
        } 
        /*
         * TELÉFONO
         */
        const phoneDigits =
            telefono.value
                .replace(/\D/g, '');
        if (
            phoneDigits.length < 10
        ) {
            telefono.focus();
            this.showToast(
                'Ingresa un número de teléfono válido.',
                'error'
            );
            return false;
        }
        /*
         * CONTACTO DE EMERGENCIA_name
         */
        if (
            !emergencia_name.value.trim()
        ) {
            emergencia_name.focus();
            this.showToast(
                'Ingresa un contacto de emergencia.',
                'error'
            );
            return false;
        }
        /*
         * CONTACTO DE EMERGENCIA_number
         */
        const emergencyDigits =
            emergencia_number.value
                .replace(/\D/g, '');
        if (
            emergencyDigits.length < 10
        ) {
            emergencia_number.focus();
            this.showToast(
                'Ingresa un número de teléfono válido.',
                'error'
            );
            return false;
        }
        /*
         * PRIVACIDAD
         */
        if (
            !privacidad.checked
        ) {
            privacidad.focus();
            this.showToast(
                'Debes aceptar el uso de datos para logística y seguridad.',
                'error'
            );
            return false;
        }
        /*
         * Concatena contacto emergencia
         */
        const emer_name = document.getElementById('emergencia_name').value.trim();
        const emer_numb = document.getElementById('emergencia_number').value.trim();
        // Asigna el valor unido a un input oculto antes de enviar
        document.getElementById('emergencia').value = `${emer_name} - ${emer_numb}`;
        return true;
    }
    /* =========================================================
       FORMULARIO - INICIALIZACIÓN
       ========================================================= */
    initForm() {
        if (!this.form) {
            return;
        }
        this.form.addEventListener(
            'submit',
            event => {
                this.submitForm(
                    event
                );
            }
        );
        if (this.resetFormBtn) {
            this.resetFormBtn.addEventListener(
                'click',
                () => {
                    this.resetRegistration();
                }
            );
        }
        if (this.shareBtn) {
            this.shareBtn.addEventListener(
                'click',
                () => {
                    this.shareRegistration();
                }
            );
        }
    }
    /* =========================================================
       FORMULARIO - ENVÍO
       ========================================================= */
    // async submitForm(event) {
    //     event.preventDefault();
    //     /*
    //      * Validar antes de enviar.
    //      */
    //     if (!this.validateForm()) {
    //         return;
    //     }
    //     /*
    //      * Evitar doble clic.
    //      */
    //     if (this.submitBtn.disabled) {
    //         return;
    //     }
    //     /*
    //      * Ocultar errores anteriores.
    //      */
    //     if (this.errorBox) {
    //         this.errorBox.classList
    //             .add('hidden');
    //     }
    //     /*
    //      * Desactivar botón.
    //      */
    //     this.submitBtn.disabled =
    //         true;
    //     this.submitBtn.innerHTML =
    //         '<i class="fa-solid fa-spinner fa-spin"></i> Enviando información...';
    //     /*
    //      * Timeout de seguridad.
    //      */
    //     const controller =
    //         new AbortController();
    //     const timeout =
    //         setTimeout(
    //             () => {
    //                 controller.abort();
    //             },
    //             20000
    //         );
    //     try {
    //         /*
    //          * Enviar formulario a Apps Script.
    //          */
    //         const response =
    //             await fetch(
    //                 this.CONFIG.scriptURL,
    //                 {
    //                     method: 'POST',
    //                     body:
    //                         new FormData(
    //                             this.form
    //                         ),
    //                     signal:
    //                         controller.signal
    //                 }
    //             );
    //         /*
    //          * Liberar timeout.
    //          */
    //         clearTimeout(
    //             timeout
    //         );
    //         /*
    //          * Verificar HTTP.
    //          */
    //         if (!response.ok) {
    //             throw new Error(
    //                 `HTTP ${response.status}`
    //             );
    //         }
    //         /*
    //          * Leer respuesta de Apps Script.
    //          */
    //         const result =
    //             await response.json();
    //         /*
    //          * Verificar resultado.
    //          */
    //         if (
    //             !result ||
    //             result.result !== 'success'
    //         ) {
    //             throw new Error(
    //                 result?.error ||
    //                 'Google Apps Script no confirmó el registro.'
    //             );
    //         }
    //         /*
    //          * =================================================
    //          * AQUÍ ESTÁ LA PARTE IMPORTANTE
    //          * =================================================
    //          *
    //          * El número NO se genera en JavaScript.
    //          *
    //          * Google Apps Script devuelve:
    //          *
    //          * {
    //          *    result: "success",
    //          *    registro: 37
    //          * }
    //          *
    //          * Nosotros utilizamos exactamente ese número.
    //          */
    //         this.registro =
    //             result.registro;
    //         /*
    //          * Mostrar número de registro.
    //          */
    //         if (this.folioElement) {
    //             this.folioElement.textContent =
    //                 `#${String(
    //                     this.registro
    //                 ).padStart(3, '0')}`;
    //         }
    //         /*
    //          * Limpiar formulario.
    //          */
    //         this.form.reset();
    //         /*
    //          * Mostrar confirmación.
    //          */
    //         if (this.successBanner) {
    //             this.successBanner
    //                 .classList
    //                 .remove('hidden');
    //         }
    //         /*
    //          * Mensaje.
    //          */
    //         this.showToast(
    //             `Registro #${this.registro} realizado correctamente.`
    //         );
    //     } catch (error) {
    //         clearTimeout(
    //             timeout
    //         );
    //         console.error(
    //             'Error al enviar registro:',
    //             error
    //         );
    //         let message =
    //             'Hubo un problema de conexión. Inténtalo nuevamente.';
    //         if (
    //             error.name ===
    //             'AbortError'
    //         ) {
    //             message =
    //                 'La solicitud tardó demasiado. Verifica tu conexión e inténtalo nuevamente.';
    //         }
    //         if (
    //             error.message &&
    //             error.message.includes(
    //                 'Google Apps Script'
    //             )
    //         ) {
    //             message =
    //                 error.message;
    //         }
    //         /*
    //          * Mostrar error dentro del formulario.
    //          */
    //         if (this.errorMessage) {
    //             this.errorMessage.textContent =
    //                 message;
    //         }
    //         if (this.errorBox) {
    //             this.errorBox.classList
    //                 .remove('hidden');
    //         }
    //         /*
    //          * Toast.
    //          */
    //         this.showToast(
    //             message,
    //             'error'
    //         );
    //     } finally {
    //         /*
    //          * Reactivar botón.
    //          */
    //         this.submitBtn.disabled =
    //             false;
    //         this.submitBtn.innerHTML =
    //             '<i class="fa-solid fa-paper-plane"></i> Enviar Mi Registro';
    //     }
    // }
    async submitForm(event) {
        /*
        * =====================================================
        * EVITAR SUBMIT NATIVO
        * =====================================================
        */
        event.preventDefault();
        event.stopPropagation();
        /*
        * =====================================================
        * EVITAR DOBLE PETICIÓN
        * =====================================================
        *
        * Esta variable es más segura que depender únicamente
        * de submitBtn.disabled.
        */
        if (this.isSubmitting) {
            console.warn(
                'Envío bloqueado: ya existe una petición en curso.'
            );
            return;
        }
        /*
        * =====================================================
        * VALIDAR FORMULARIO
        * =====================================================
        */
        if (!this.validateForm()) {
            return;
        }
        /*
        * =====================================================
        * ACTIVAR BLOQUEO
        * =====================================================
        */
        this.isSubmitting = true;
        /*
        * =====================================================
        * OCULTAR ERROR ANTERIOR
        * =====================================================
        */
        if (this.errorBox) {
            this.errorBox.classList.add(
                'hidden'
            );
        }
        /*
        * =====================================================
        * DESACTIVAR BOTÓN
        * =====================================================
        */
        if (this.submitBtn) {
            this.submitBtn.disabled = true;
            this.submitBtn.innerHTML =
                '<i class="fa-solid fa-spinner fa-spin"></i> Enviando información...';
        }
        /*
        * =====================================================
        * TIMEOUT
        * =====================================================
        */
        const controller =
            new AbortController();
        const timeout =
            setTimeout(
                () => {
                    controller.abort();
                },
                20000
            );
        try {
            /*
            * =================================================
            * CREAR FORM DATA
            * =================================================
            */
            const formData =
                new FormData(
                    this.form
                );
            /*
            * =================================================
            * POST
            * =================================================
            */
            console.log(
                '[RABIOSA] Enviando POST a Apps Script...'
            );
            const response =
                await fetch(
                    this.CONFIG.scriptURL,
                    {
                        method: 'POST',
                        body: formData,
                        signal: controller.signal
                    }
                );
            /*
            * =================================================
            * LIMPIAR TIMEOUT
            * =================================================
            */
            clearTimeout(
                timeout
            );
            /*
            * =================================================
            * VERIFICAR RESPUESTA HTTP
            * =================================================
            */
            if (!response.ok) {
                throw new Error(
                    `HTTP ${response.status}`
                );
            }
            /*
            * =================================================
            * LEER JSON
            * =================================================
            */
            const result =
                await response.json();
            console.log(
                '[RABIOSA] Respuesta Apps Script:',
                result
            );
            /*
            * =================================================
            * VALIDAR RESPUESTA DEL SERVIDOR
            * =================================================
            *
            * IMPORTANTE:
            *
            * Si Apps Script responde:
            *
            * {
            *   result: "error",
            *   error: "Este número ya tiene 2 registros..."
            * }
            *
            * mostramos EXACTAMENTE ese mensaje.
            */
            if (
                !result ||
                result.result !== 'success'
            ) {
                throw new Error(
                    result?.error ||
                    'Google Apps Script no confirmó el registro.'
                );
            }
            /*
            * =================================================
            * REGISTRO EXITOSO
            * =================================================
            */
            this.registro =
                result.registro;
            /*
            * =================================================
            * MOSTRAR FOLIO
            * =================================================
            */
            if (this.folioElement) {
                this.folioElement.textContent =
                    `#${String(
                        this.registro
                    ).padStart(3, '0')}`;
            }
            /*
            * =================================================
            * LIMPIAR FORMULARIO
            * =================================================
            */
            this.form.reset();
            /*
            * =================================================
            * MOSTRAR CONFIRMACIÓN
            * =================================================
            */
            if (this.successBanner) {
                this.successBanner.classList
                    .remove('hidden');
            }
            /*
            * =================================================
            * TOAST ÉXITO
            * =================================================
            */
            this.showToast(
                `Registro #${this.registro} realizado correctamente.`
            );
        } catch (error) {
            clearTimeout(
                timeout
            );
            console.error(
                '[RABIOSA] Error al enviar registro:',
                error
            );
            /*
            * =================================================
            * MENSAJE POR DEFECTO
            * =================================================
            */
            let message =
                'No pudimos enviar tu registro. Inténtalo nuevamente.';
            /*
            * =================================================
            * TIMEOUT
            * =================================================
            */
            if (
                error.name ===
                'AbortError'
            ) {
                message =
                    'La solicitud tardó demasiado. Verifica tu conexión e inténtalo nuevamente.';
            }
            /*
            * =================================================
            * ERROR DEL SERVIDOR
            * =================================================
            *
            * Si Apps Script rechazó el registro,
            * mostramos su mensaje.
            */
            else if (
                error.message &&
                error.message !== ''
            ) {
                /*
                * Si es un error generado por Apps Script,
                * mostrarlo directamente.
                *
                * Ejemplo:
                *
                * "Este número de teléfono ya tiene 2
                * registros..."
                */
                message =
                    error.message;
            }
            /*
            * =================================================
            * MOSTRAR ERROR EN FORMULARIO
            * =================================================
            */
            if (this.errorMessage) {
                this.errorMessage.textContent =
                    message;
            }
            if (this.errorBox) {
                this.errorBox.classList
                    .remove('hidden');
            }
            /*
            * =================================================
            * TOAST
            * =================================================
            */
            this.showToast(
                message,
                'error'
            );
        } finally {
            /*
            * =================================================
            * LIBERAR BLOQUEO
            * =================================================
            */
            this.isSubmitting =
                false;
            /*
            * =================================================
            * REACTIVAR BOTÓN
            * =================================================
            */
            if (this.submitBtn) {
                this.submitBtn.disabled =
                    false;
                this.submitBtn.innerHTML =
                    '<i class="fa-solid fa-paper-plane"></i> Enviar Mi Registro';
            }
        }
    }
    /* =========================================================
       REINICIAR REGISTRO
       ========================================================= */
    resetRegistration() {
        /*
         * Ocultar confirmación.
         */
        if (this.successBanner) {
            this.successBanner
                .classList
                .add('hidden');
        }
        /*
         * Regresar al formulario.
         */
        const registroSection =
            document.getElementById(
                'registro'
            );
        if (registroSection) {
            window.scrollTo({
                top:
                    registroSection.offsetTop -
                    90,
                behavior:
                    'smooth'
            });
        }
    }
    /* =========================================================
       COMPARTIR REGISTRO
       ========================================================= */
    async shareRegistration() {
        /*
         * Si no existe registro,
         * no hacemos nada.
         */
        if (!this.registro) {
            return;
        }
        const shareText =
            `🚴 ¡Estoy registrado para La Rabiosa!
            MTB PUG'S - 3er Aniversario
            📅 22 de noviembre de 2026
            📍 Santa Cruz El Porvenir, Ixtacuixtla
            🎫 Registro #${String(
                            this.registro
                        ).padStart(3, '0')}
            ¡Nos vemos en la rodada!
            Registrate aquí: ${this.CONFIG.urlPage}`;
        /*
         * Dispositivos que soportan
         * Web Share API.
         */
        if (
            navigator.share
        ) {
            try {
                await navigator.share({
                    title:
                        'Rodada La Rabiosa',
                    text:
                        shareText
                });
            } catch (error) {
                console.log(
                    'Compartir cancelado.'
                );
            }
            return;
        }
        /*
         * Si no existe Web Share,
         * copiamos al portapapeles.
         */
        try {
            await navigator
                .clipboard
                .writeText(
                    shareText
                );
            this.showToast(
                'Información del registro copiada.'
            );
        } catch (error) {
            this.showToast(
                'No fue posible copiar la información.',
                'error'
            );
        }
    }
    initSecurityToken() {
        const tokenField =
            document.getElementById(
                'form-token'
            );
        if (!tokenField) {
            return;
        }
        const token =
            crypto.randomUUID();
        tokenField.value =
            token;
    }
}
/* ============================================================
   ARRANQUE
   ============================================================ */
/* document.addEventListener(
    'DOMContentLoaded',
    () => {
        window.rabiosaApp =
            new RabiosaApp();
    }
); */
document.addEventListener(
    'DOMContentLoaded',
    () => {
        /*
         * =====================================================
         * EVITAR INICIALIZACIÓN DUPLICADA
         * =====================================================
         */
        if (
            window.rabiosaApp
        ) {
            console.warn(
                '[RABIOSA] La aplicación ya fue inicializada.'
            );
            return;
        }
        window.rabiosaApp =
            new RabiosaApp();
    }
);
// ============================================================
// CARRUSEL DINÁMICO DE PATROCINADORES
// ============================================================

class SponsorsCarousel {

    constructor() {

        this.carousel =
            document.getElementById(
                'sponsors-carousel'
            );

        this.prevBtn =
            document.getElementById(
                'sponsors-prev'
            );

        this.nextBtn =
            document.getElementById(
                'sponsors-next'
            );

        this.dotsContainer =
            document.getElementById(
                'sponsors-dots'
            );

        this.currentIndex = 0;

        this.autoPlayInterval = null;

        this.slides = [];

        /*
         * URL del Apps Script.
         */
        this.scriptURL =
            window.RABIOSA_CONFIG
                ?.scriptURL || '';

        /*
         * Si no existe el carrusel,
         * no hacemos nada.
         */
        if (!this.carousel) {
            return;
        }

        this.loadSponsors();
    }


    // ========================================================
    // CARGAR PATROCINADORES
    // ========================================================

    async loadSponsors() {

        try {

            if (!this.scriptURL) {

                throw new Error(
                    'No se encontró la URL de Google Apps Script.'
                );

            }

            /*
             * Indicador temporal.
             */
            this.carousel.innerHTML = `
                <div class="
                    w-full
                    flex
                    items-center
                    justify-center
                    py-10
                    text-zinc-500
                    text-sm
                    font-bold
                ">
                    <i class="
                        fa-solid
                        fa-spinner
                        fa-spin
                        text-yellow-400
                        mr-2
                    "></i>

                    Cargando patrocinadores...
                </div>
            `;


            const response =
                await fetch(
                    `${this.scriptURL}?sponsors=1`,
                    {
                        method: 'GET',
                        cache: 'no-store'
                    }
                );


            if (!response.ok) {

                throw new Error(
                    'No fue posible consultar los patrocinadores.'
                );

            }


            const data =
                await response.json();


            if (
                data.result !== 'success'
            ) {

                throw new Error(
                    data.error ||
                    'Google Apps Script no pudo obtener los patrocinadores.'
                );

            }


            const patrocinadores =
                Array.isArray(
                    data.patrocinadores
                )
                    ? data.patrocinadores
                    : [];


            this.renderSponsors(
                patrocinadores
            );


        } catch (error) {

            console.error(
                'Error cargando patrocinadores:',
                error
            );

            this.showEmptyState();

        }

    }


    // ========================================================
    // GENERAR TARJETAS
    // ========================================================

    renderSponsors(
        patrocinadores
    ) {

        this.carousel.innerHTML = '';

        /*
         * Si no existen patrocinadores activos.
         */
        if (
            !patrocinadores.length
        ) {

            this.showEmptyState();

            return;
        }


        patrocinadores.forEach(
            sponsor => {

                const slide =
                    document.createElement(
                        'a'
                    );

                slide.className = `
                    sponsor-slide
                    flex-none
                    w-[75%]
                    sm:w-[45%]
                    md:w-[30%]
                    lg:w-[23%]
                    snap-center
                    bg-black
                    border
                    border-zinc-800
                    hover:border-yellow-400/60
                    rounded-xl
                    h-28
                    sm:h-32
                    p-5
                    flex
                    items-center
                    justify-center
                    transition
                    duration-300
                    hover:scale-[1.02]
                `;


                /*
                 * Si tiene enlace,
                 * lo utilizamos.
                 */
                if (
                    sponsor.enlace
                ) {

                    slide.href =
                        sponsor.enlace;

                    slide.target =
                        '_blank';

                    slide.rel =
                        'noopener noreferrer';

                } else {

                    /*
                     * Si no tiene enlace,
                     * no hacemos que parezca
                     * un enlace.
                     */
                    slide.href =
                        'javascript:void(0)';

                    slide.removeAttribute(
                        'target'
                    );

                }


                /*
                 * Imagen
                 */
                const img =
                    document.createElement(
                        'img'
                    );

                img.src =
                    sponsor.logo;

                img.alt =
                    sponsor.nombre ||
                    'Patrocinador oficial';

                img.loading =
                    'lazy';

                img.decoding =
                    'async';

                img.className =
                    'max-h-full max-w-full object-contain';


                /*
                 * Fallback visual.
                 */
                img.onerror =
                    () => {

                        img.style.display =
                            'none';

                        fallback.style.display =
                            'block';

                    };


                /*
                 * Texto alternativo
                 * en caso de error.
                 */
                const fallback =
                    document.createElement(
                        'span'
                    );

                fallback.className =
                    'text-xs text-zinc-500 font-bold text-center';

                fallback.textContent =
                    sponsor.nombre ||
                    'PATROCINADOR';

                fallback.style.display =
                    'none';


                slide.appendChild(
                    img
                );

                slide.appendChild(
                    fallback
                );


                this.carousel.appendChild(
                    slide
                );

            }
        );


        /*
         * Actualizar colección
         * de slides.
         */
        this.slides =
            Array.from(
                this.carousel.querySelectorAll(
                    '.sponsor-slide'
                )
            );


        this.currentIndex = 0;


        /*
         * Inicializar carrusel.
         */
        this.initCarousel();

    }


    // ========================================================
    // ESTADO SIN PATROCINADORES
    // ========================================================

    showEmptyState() {

        this.carousel.innerHTML = `
            <div class="
                w-full
                text-center
                py-8
                text-zinc-600
                text-sm
                font-bold
            ">
                Próximamente conocerás
                a nuestros patrocinadores.
            </div>
        `;


        if (
            this.dotsContainer
        ) {

            this.dotsContainer.innerHTML =
                '';

        }

        if (
            this.prevBtn
        ) {

            this.prevBtn.classList.add(
                'hidden'
            );

        }

        if (
            this.nextBtn
        ) {

            this.nextBtn.classList.add(
                'hidden'
            );

        }

    }


    // ========================================================
    // INICIALIZAR CARRUSEL
    // ========================================================

    initCarousel() {

        /*
         * Mostrar botones.
         */
        if (
            this.prevBtn
        ) {

            this.prevBtn.classList.remove(
                'hidden'
            );

        }

        if (
            this.nextBtn
        ) {

            this.nextBtn.classList.remove(
                'hidden'
            );

        }


        this.createDots();


        if (
            this.prevBtn
        ) {

            this.prevBtn.addEventListener(
                'click',
                () => this.prev()
            );

        }


        if (
            this.nextBtn
        ) {

            this.nextBtn.addEventListener(
                'click',
                () => this.next()
            );

        }


        this.carousel.addEventListener(
            'scroll',
            () => this.updateActiveDot()
        );


        /*
         * Pausar al interactuar.
         */
        this.carousel.addEventListener(
            'mouseenter',
            () => this.stopAutoPlay()
        );


        this.carousel.addEventListener(
            'mouseleave',
            () => this.startAutoPlay()
        );


        this.carousel.addEventListener(
            'touchstart',
            () => this.stopAutoPlay(),
            {
                passive: true
            }
        );


        this.carousel.addEventListener(
            'touchend',
            () => this.startAutoPlay()
        );


        this.startAutoPlay();

        this.updateActiveDot();

    }


    // ========================================================
    // ANCHO DE SLIDE
    // ========================================================

    getSlideWidth() {

        if (
            !this.slides.length
        ) {

            return 0;

        }


        const slide =
            this.slides[0];


        const style =
            window.getComputedStyle(
                this.carousel
            );


        const gap =
            parseFloat(
                style.columnGap ||
                style.gap ||
                0
            );


        return (
            slide.offsetWidth +
            gap
        );

    }


    // ========================================================
    // SIGUIENTE
    // ========================================================

    next() {

        const slideWidth =
            this.getSlideWidth();


        if (!slideWidth) {
            return;
        }


        const maxScroll =
            this.carousel.scrollWidth -
            this.carousel.clientWidth;


        const nextPosition =
            this.carousel.scrollLeft +
            slideWidth;


        if (
            nextPosition >=
            maxScroll - 10
        ) {

            this.carousel.scrollTo({
                left: 0,
                behavior: 'smooth'
            });

        } else {

            this.carousel.scrollBy({
                left: slideWidth,
                behavior: 'smooth'
            });

        }

    }


    // ========================================================
    // ANTERIOR
    // ========================================================

    prev() {

        const slideWidth =
            this.getSlideWidth();


        if (!slideWidth) {
            return;
        }


        if (
            this.carousel.scrollLeft <= 10
        ) {

            this.carousel.scrollTo({
                left:
                    this.carousel.scrollWidth,
                behavior:
                    'smooth'
            });

        } else {

            this.carousel.scrollBy({
                left:
                    -slideWidth,
                behavior:
                    'smooth'
            });

        }

    }


    // ========================================================
    // DOTS
    // ========================================================

    createDots() {

        if (
            !this.dotsContainer
        ) {

            return;

        }


        this.dotsContainer.innerHTML =
            '';


        this.slides.forEach(
            (slide, index) => {

                const dot =
                    document.createElement(
                        'button'
                    );


                dot.type =
                    'button';


                dot.className =
                    'sponsor-dot';


                dot.setAttribute(
                    'aria-label',
                    `Ver patrocinador ${index + 1}`
                );


                dot.addEventListener(
                    'click',
                    () =>
                        this.goTo(
                            index
                        )
                );


                this.dotsContainer.appendChild(
                    dot
                );

            }
        );


        this.dots =
            Array.from(
                this.dotsContainer.children
            );

    }


    // ========================================================
    // IR A SLIDE
    // ========================================================

    goTo(index) {

        if (
            !this.slides[index]
        ) {

            return;

        }


        const slideWidth =
            this.getSlideWidth();


        this.carousel.scrollTo({

            left:
                slideWidth * index,

            behavior:
                'smooth'

        });


        this.currentIndex =
            index;


        this.updateDots();

    }


    // ========================================================
    // ACTUALIZAR DOT
    // ========================================================

    updateActiveDot() {

        if (
            !this.slides.length
        ) {

            return;

        }


        const slideWidth =
            this.getSlideWidth();


        if (!slideWidth) {
            return;
        }


        const index =
            Math.round(
                this.carousel.scrollLeft /
                slideWidth
            );


        this.currentIndex =
            Math.min(
                Math.max(
                    index,
                    0
                ),
                this.slides.length - 1
            );


        this.updateDots();

    }


    // ========================================================
    // ACTUALIZAR DOTS
    // ========================================================

    updateDots() {

        if (!this.dots) {
            return;
        }


        this.dots.forEach(
            (dot, index) => {

                dot.classList.toggle(
                    'active',
                    index ===
                    this.currentIndex
                );

            }
        );

    }


    // ========================================================
    // AUTOPLAY
    // ========================================================

    startAutoPlay() {

        this.stopAutoPlay();


        /*
         * Si hay un solo patrocinador
         * no necesitamos autoplay.
         */
        if (
            this.slides.length <= 1
        ) {

            return;

        }


        this.autoPlayInterval =
            setInterval(
                () => this.next(),
                2500
            );

    }


    // ========================================================
    // DETENER AUTOPLAY
    // ========================================================

    stopAutoPlay() {

        if (
            this.autoPlayInterval
        ) {

            clearInterval(
                this.autoPlayInterval
            );

            this.autoPlayInterval =
                null;

        }

    }

}

// Inicializar cuando el DOM esté listo
document.addEventListener(
    'DOMContentLoaded',
    () => {
        new SponsorsCarousel();
    }
);