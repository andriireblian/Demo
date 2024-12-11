require('../acc.change-pwd');
require('../acc.learner-login');

describe('tests for change-pwd file', () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <input id="updatePwdToken" type="hidden">
            <input id="updatePwdUserId" type="hidden">
            <button type="button" class="js-handle-password-button"></button>
            <button type="button" class="js-cancel-change-pwd-popup-button" data-cancel-url="test"</button>
        `;
    });

    afterEach(() => {
        document.body.innerHTML = '';
        jest.clearAllMocks();
    });

    test('test initialize method', () => {
        const handleInputTypeSpy = jest.spyOn(ACC.learnerlogin, 'handleInputType');

        ACC.changepwd.initialize();

        expect(handleInputTypeSpy).toHaveBeenCalled();
        expect(piSession.getToken).toHaveBeenCalledWith(expect.any(Function));
    });

    test('test cancel button click', () => {
        const changeLocationSpy = jest.spyOn(ACC.changepwd, 'changeLocationToCancelURL');
        const cancelButton = document.querySelector('.js-cancel-change-pwd-popup-button');

        ACC.changepwd.showCancelPwdChangeConfirmation();
        cancelButton.click();

        expect(changeLocationSpy).toHaveBeenCalled();
    });

    test('test update password token and user id', () => {
        ACC.changepwd.updatePwdTokenUserId('success', 'testtoken');

        expect(document.querySelector('#updatePwdToken').value).toBe('testtoken');
        expect(document.querySelector('#updatePwdUserId').value).toBe('12345');
    });

    test('test init without updatePwdToken', () => {
        document.body.innerHTML = '';

        ACC.changepwd.initialize();

        expect(piSession.getToken).not.toHaveBeenCalled();
    });
});
