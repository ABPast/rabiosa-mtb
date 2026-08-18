/* ============================================================
   MTB PUG'S - RODADA "LA RABIOSA"
   Controlador principal de la página
   ============================================================ */

class RabiosaApp {

    constructor() {
        this.CONFIG = {
            scriptURL:
                'https://script.google.com/macros/s/AKfycbzmaGm1b3lPhTSBjeS-tpHgjIfPEtQzylDAA-N5-6yDVp_-xYSV-2ebG1veVvXmt79ydg/exec',

            eventDate:
                '2026-11-22T08:00:00-06:00',

            // Coloca aquí las URL reales de Strava.
            stravaShort: '',
            stravaLong: '',

            // Formato: 521XXXXXXXXXX, sin +, espacios ni guiones.
            whatsapp: '5212481294043'
        };

        this.generatedFolio = '';
        this.toastTimeout = null;

        this.cacheElements();
        this.init();
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
        this.initForm();
    }

    cacheElements() {
        this.form = document.getElementById('registro-form');
        this.submitBtn = document.getElementById('submit-btn');

        this.successBanner =
            document.getElementById('form-success-banner');

        this.errorBox =
            document.getElementById('form-error');

        this.errorMessage =
            document.getElementById('form-error-message');

        this.resetFormBtn =
            document.getElementById('reset-form-btn');

        this.shareBtn =
            document.getElementById('share-registration-btn');

        this.folioElement =
            document.getElementById('confirmation-folio');

        this.menuBtn =
            document.getElementById('menu-btn');

        this.mobileMenu =
            document.getElementById('mobile-menu');

        this.menuIcon =
            document.getElementById('menu-icon');

        this.shortStrava =
            document.getElementById('strava-short-link');

        this.longStrava =
            document.getElementById('strava-long-link');

        this.whatsappLink =
            document.getElementById('whatsapp-link');

        this.toast =
            document.getElementById('toast');

        this.toastMessage =
            document.getElementById('toast-message');

        this.toastIcon =
            document.getElementById('toast-icon');

        this.days =
            document.getElementById('days');

        this.hours =
            document.getElementById('hours');

        this.minutes =
            document.getElementById('minutes');

        this.seconds =
            document.getElementById('seconds');
    }

    /* =========================================================
       MENÚ MÓVIL
       ========================================================= */

    initMobileMenu() {
        if (!this.menuBtn || !this.mobileMenu) return;

        this.menuBtn.addEventListener('click', () => {
            const isHidden =
                this.mobileMenu.classList.contains('hidden');

            this.mobileMenu.classList.toggle('hidden');

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
        });

        document.querySelectorAll('.mobile-link')
            .forEach(link => {
                link.addEventListener('click', () => {
                    this.closeMobileMenu();
                });
            });
    }

    closeMobileMenu() {
        if (!this.mobileMenu) return;

        this.mobileMenu.classList.add('hidden');

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
            () => this.updateCountdown(),
            1000
        );
    }

    updateCountdown() {
        if (!this.days) return;

        const eventDate =
            new Date(this.CONFIG.eventDate).getTime();

        const now =
            Date.now();

        const difference =
            eventDate - now;

        if (difference <= 0) {
            this.days.textContent = '00';
            this.hours.textContent = '00';
            this.minutes.textContent = '00';
            this.seconds.textContent = '00';
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
            String(days).padStart(2, '0');

        this.hours.textContent =
            String(hours).padStart(2, '0');

        this.minutes.textContent =
            String(minutes).padStart(2, '0');

        this.seconds.textContent =
            String(seconds).padStart(2, '0');
    }

    /* =========================================================
       FAQ
       ========================================================= */

    initFaq() {
        document.querySelectorAll('.faq-button')
            .forEach(button => {
                button.addEventListener('click', () => {
                    const item =
                        button.closest('.faq-item');

                    const wasActive =
                        item.classList.contains('active');

                    document.querySelectorAll('.faq-item')
                        .forEach(otherItem => {
                            otherItem.classList.remove('active');
                        });

                    if (!wasActive) {
                        item.classList.add('active');
                    }
                });
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

    configureStravaLink(element, url) {
        if (!element) return;

        if (!url) {
            element.removeAttribute('href');

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
        if (!this.whatsappLink || !this.CONFIG.whatsapp) {
            return;
        }

        const message =
            'Hola MTB Pug\'s, tengo una duda sobre la Rodada La Rabiosa.';

        this.whatsappLink.href =
            `https://wa.me/${this.CONFIG.whatsapp}?text=${encodeURIComponent(message)}`;

        this.whatsappLink.classList.remove('hidden');
    }

    /* =========================================================
       TOAST
       ========================================================= */

    showToast(message, type = 'success') {
        if (!this.toast) return;

        this.toastMessage.textContent = message;

        this.toastIcon.className =
            type === 'error'
                ? 'fa-solid fa-circle-exclamation text-red-400 text-xl'
                : 'fa-solid fa-circle-check text-yellow-400 text-xl';

        this.toast.classList.add('show');

        clearTimeout(this.toastTimeout);

        this.toastTimeout =
            setTimeout(() => {
                this.toast.classList.remove('show');
            }, 4000);
    }

    /* =========================================================
       FOLIO
       ========================================================= */

    generateFolio() {
        const random =
            Math.floor(
                10000 +
                Math.random() * 90000
            );

        return `RAB-${random}`;
    }

    /* =========================================================
       VALIDACIÓN
       ========================================================= */

    validateForm() {
        const nombre =
            document.getElementById('nombre');

        const edad =
            document.getElementById('edad');

        const telefono =
            document.getElementById('telefono');

        const emergencia =
            document.getElementById('emergencia');

        const privacidad =
            document.getElementById('privacidad');

        if (!nombre.value.trim()) {
            nombre.focus();

            this.showToast(
                'Ingresa tu nombre completo.',
                'error'
            );

            return false;
        }

        const age =
            Number(edad.value);

        if (!age || age < 15 || age > 100) {
            edad.focus();

            this.showToast(
                'La edad debe estar entre 15 y 100 años.',
                'error'
            );

            return false;
        }

        const phoneDigits =
            telefono.value.replace(/\D/g, '');

        if (phoneDigits.length < 10) {
            telefono.focus();

            this.showToast(
                'Ingresa un número de teléfono válido.',
                'error'
            );

            return false;
        }

        if (!emergencia.value.trim()) {
            emergencia.focus();

            this.showToast(
                'Ingresa un contacto de emergencia.',
                'error'
            );

            return false;
        }

        if (!privacidad.checked) {
            privacidad.focus();

            this.showToast(
                'Debes aceptar el uso de datos para logística y seguridad.',
                'error'
            );

            return false;
        }

        return true;
    }

    /* =========================================================
       FORMULARIO
       ========================================================= */

    initForm() {
        if (!this.form) return;

        this.form.addEventListener(
            'submit',
            event => this.submitForm(event)
        );

        if (this.resetFormBtn) {
            this.resetFormBtn.addEventListener(
                'click',
                () => this.resetRegistration()
            );
        }

        if (this.shareBtn) {
            this.shareBtn.addEventListener(
                'click',
                () => this.shareRegistration()
            );
        }
    }

    async submitForm(event) {
        event.preventDefault();

        if (!this.validateForm()) {
            return;
        }

        if (this.submitBtn.disabled) {
            return;
        }

        this.errorBox.classList.add('hidden');

        this.submitBtn.disabled = true;

        this.submitBtn.innerHTML =
            '<i class="fa-solid fa-spinner loading-spinner"></i> Enviando información...';

        const controller =
            new AbortController();

        const timeout =
            setTimeout(
                () => controller.abort(),
                15000
            );

        try {
            const response =
                await fetch(
                    this.CONFIG.scriptURL,
                    {
                        method: 'POST',
                        body: new FormData(this.form),
                        signal: controller.signal
                    }
                );

            clearTimeout(timeout);

            if (!response.ok) {
                throw new Error(
                    `HTTP ${response.status}`
                );
            }

            /*
             * Actualmente el folio se genera en el navegador.
             *
             * Recomendación:
             * posteriormente mover esta generación a
             * Google Apps Script para que sea único y definitivo.
             */
            this.generatedFolio =
                this.generateFolio();

            this.folioElement.textContent =
                this.generatedFolio;

            this.form.reset();

            this.successBanner.classList.remove(
                'hidden'
            );

            this.showToast(
                'Registro enviado correctamente.'
            );

        } catch (error) {
            clearTimeout(timeout);

            console.error(
                'Error al enviar:',
                error
            );

            let message =
                'Hubo un problema de conexión. Inténtalo nuevamente.';

            if (error.name === 'AbortError') {
                message =
                    'La solicitud tardó demasiado. Verifica tu conexión e inténtalo nuevamente.';
            }

            this.errorMessage.textContent =
                message;

            this.errorBox.classList.remove(
                'hidden'
            );

            this.showToast(
                message,
                'error'
            );

        } finally {
            this.submitBtn.disabled = false;

            this.submitBtn.innerHTML =
                '<i class="fa-solid fa-paper-plane"></i> Enviar Mi Registro Gratis';
        }
    }

    /* =========================================================
       REINICIAR REGISTRO
       ========================================================= */

    resetRegistration() {
        this.successBanner.classList.add('hidden');

        const registro =
            document.getElementById('registro');

        if (registro) {
            window.scrollTo({
                top: registro.offsetTop - 90,
                behavior: 'smooth'
            });
        }
    }

    /* =========================================================
       COMPARTIR REGISTRO
       ========================================================= */

    async shareRegistration() {
        const nombre =
            document.getElementById('nombre')?.value ||
            'Participante';

        const shareText =
            `🚴 ¡Estoy registrado para La Rabiosa!
MTB Pug's - 3er Aniversario
📅 22 de noviembre de 2026
📍 Santa Cruz El Porvenir, Ixtacuixtla
🎫 Folio: ${this.generatedFolio}
¡Nos vemos en la rodada!`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Rodada La Rabiosa',
                    text: shareText
                });
            } catch (error) {
                console.log(
                    'Compartir cancelado.'
                );
            }

            return;
        }

        try {
            await navigator.clipboard.writeText(
                shareText
            );

            this.showToast(
                'Información copiada para compartir.'
            );

        } catch (error) {
            this.showToast(
                'No fue posible copiar la información.',
                'error'
            );
        }
    }
}

/* ============================================================
   ARRANQUE DE LA APLICACIÓN
   ============================================================ */

document.addEventListener(
    'DOMContentLoaded',
    () => {
        window.rabiosaApp =
            new RabiosaApp();
    }
);
