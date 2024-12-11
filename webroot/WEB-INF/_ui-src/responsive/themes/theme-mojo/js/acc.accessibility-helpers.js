ACC.accessibilityHelpers = {
    setAriaInvalidAttributes() {
        const invalidFields = document.querySelectorAll('.has-error input');
        if (invalidFields.length) {
            invalidFields.forEach((element) => {
                element.setAttribute('aria-invalid', 'true');
            });
        }
    },

    showContent() {
        // Show another content for accessibility API
        document.querySelector('main').removeAttribute('aria-hidden');
        document.querySelector('body').removeAttribute('style');
    },
};
