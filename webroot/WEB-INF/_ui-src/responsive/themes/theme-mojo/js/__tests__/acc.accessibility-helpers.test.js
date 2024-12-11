require('../acc.accessibility-helpers');

describe('run tests for accessibility-helpers file', () => {
    const inputError = `
        <div class="form-group has-error">
          <input type="text">
        </div>
    `;

    const inputGroup = `
        <div class="form-group">
          <input type="text">
        </div>
    `;

    const pageContent = `
        <main aria-hidden="true">main content</main>
    `;

    test('set aria attribute for input element', () => {
        document.body.innerHTML = inputError;
        ACC.accessibilityHelpers.setAriaInvalidAttributes();
        const input = document.querySelector('.has-error input');
        const isInvalid = input.getAttribute('aria-invalid');
        expect(isInvalid).toEqual('true');
    });

    test('set aria attribute for two input elements', () => {
        document.body.innerHTML = `${inputError}${inputError}`;
        ACC.accessibilityHelpers.setAriaInvalidAttributes();
        const [input1, input2] = document.querySelectorAll('.has-error input');
        const isInvalid1 = input1.getAttribute('aria-invalid');
        const isInvalid2 = input2.getAttribute('aria-invalid');
        expect(isInvalid1).toEqual('true');
        expect(isInvalid2).toEqual('true');
    });

    test('aria attribute should not exist on element', () => {
        document.body.innerHTML = inputGroup;
        ACC.accessibilityHelpers.setAriaInvalidAttributes();
        const input = document.querySelector('input');
        const isInvalid = input.getAttribute('aria-invalid');
        expect(isInvalid).toEqual(null);
    });

    test('should show content from the accessibility prospective', () => {
        document.body.innerHTML = pageContent;
        document.body.style.overflow = 'hidden';
        const body = document.querySelector('body');
        const mainContent = document.querySelector('main');
        ACC.accessibilityHelpers.showContent();
        expect(body.style.overflow).toEqual('');
        expect(mainContent.getAttribute('aria-hidden')).toBeFalsy();
    });
});
