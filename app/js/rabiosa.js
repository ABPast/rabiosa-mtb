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
            whatsapp: '5212481294043',
            groupWhats: 'https://chat.whatsapp.com/TU_LINK_DE_GRUPO',
        };
        /*
         * =====================================================
         * VARIABLES
         * =====================================================
         */
        this.registro = null;
        this.toastTimeout = null;
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
            'Hola MTB Pug\'s, tengo una duda sobre la Rodada La Rabiosa.';
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
    async submitForm(event) {
        event.preventDefault();
        /*
         * Validar antes de enviar.
         */
        if (!this.validateForm()) {
            return;
        }
        /*
         * Evitar doble clic.
         */
        if (this.submitBtn.disabled) {
            return;
        }
        /*
         * Ocultar errores anteriores.
         */
        if (this.errorBox) {
            this.errorBox.classList
                .add('hidden');
        }
        /*
         * Desactivar botón.
         */
        this.submitBtn.disabled =
            true;
        this.submitBtn.innerHTML =
            '<i class="fa-solid fa-spinner fa-spin"></i> Enviando información...';
        /*
         * Timeout de seguridad.
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
             * Enviar formulario a Apps Script.
             */
            const response =
                await fetch(
                    this.CONFIG.scriptURL,
                    {
                        method: 'POST',
                        body:
                            new FormData(
                                this.form
                            ),
                        signal:
                            controller.signal
                    }
                );
            /*
             * Liberar timeout.
             */
            clearTimeout(
                timeout
            );
            /*
             * Verificar HTTP.
             */
            if (!response.ok) {
                throw new Error(
                    `HTTP ${response.status}`
                );
            }
            /*
             * Leer respuesta de Apps Script.
             */
            const result =
                await response.json();
            /*
             * Verificar resultado.
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
             * AQUÍ ESTÁ LA PARTE IMPORTANTE
             * =================================================
             *
             * El número NO se genera en JavaScript.
             *
             * Google Apps Script devuelve:
             *
             * {
             *    result: "success",
             *    registro: 37
             * }
             *
             * Nosotros utilizamos exactamente ese número.
             */
            this.registro =
                result.registro;
            /*
             * Mostrar número de registro.
             */
            if (this.folioElement) {
                this.folioElement.textContent =
                    `#${String(
                        this.registro
                    ).padStart(3, '0')}`;
            }
            /*
             * Limpiar formulario.
             */
            this.form.reset();
            /*
             * Mostrar confirmación.
             */
            if (this.successBanner) {
                this.successBanner
                    .classList
                    .remove('hidden');
            }
            /*
             * Mensaje.
             */
            this.showToast(
                `Registro #${this.registro} realizado correctamente.`
            );
        } catch (error) {
            clearTimeout(
                timeout
            );
            console.error(
                'Error al enviar registro:',
                error
            );
            let message =
                'Hubo un problema de conexión. Inténtalo nuevamente.';
            if (
                error.name ===
                'AbortError'
            ) {
                message =
                    'La solicitud tardó demasiado. Verifica tu conexión e inténtalo nuevamente.';
            }
            if (
                error.message &&
                error.message.includes(
                    'Google Apps Script'
                )
            ) {
                message =
                    error.message;
            }
            /*
             * Mostrar error dentro del formulario.
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
             * Toast.
             */
            this.showToast(
                message,
                'error'
            );
        } finally {
            /*
             * Reactivar botón.
             */
            this.submitBtn.disabled =
                false;
            this.submitBtn.innerHTML =
                '<i class="fa-solid fa-paper-plane"></i> Enviar Mi Registro Gratis';
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
MTB Pug's - 3er Aniversario
📅 22 de noviembre de 2026
📍 Santa Cruz El Porvenir, Ixtacuixtla
🎫 Registro #${String(
                this.registro
            ).padStart(3, '0')}
¡Nos vemos en la rodada!`;
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
document.addEventListener(
    'DOMContentLoaded',
    () => {
        window.rabiosaApp =
            new RabiosaApp();
    }
);