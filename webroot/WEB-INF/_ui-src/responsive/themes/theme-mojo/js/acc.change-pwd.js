ACC.changepwd = {

    _autoload: [
        'initialize',
        'showCancelPwdChangeConfirmation',
    ],

    initialize() {
        ACC.learnerlogin.handleInputType();
        if ($('#updatePwdToken').length > 0 && piSession) {
            piSession.getToken(ACC.changepwd.updatePwdTokenUserId);
        }
    },

    updatePwdTokenUserId(status, token) {
        $('#updatePwdToken').val(token);
        $('#updatePwdUserId').val(piSession.userId());
    },

    showCancelPwdChangeConfirmation() {
        $('.js-cancel-change-pwd-popup-button').on('click', ACC.changepwd.changeLocationToCancelURL);
    },

    changeLocationToCancelURL() {
        window.location = $(this).data('cancelUrl');
    },
};
