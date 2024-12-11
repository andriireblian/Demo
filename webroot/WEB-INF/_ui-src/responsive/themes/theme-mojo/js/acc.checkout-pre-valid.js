ACC.checkoutPreValid = {

    _autoload: [
        ['init', $('.checkout .c-tabs-wrapper').length !== 0],
    ],

    state: {
        newCard: {
            cardNumber: false,
            expireMonth: false,
            expireYear: false,
            cvv: false,
        },
        savedCard: {
            cvv: false,
        },
        terms: true,
        hasCalculatedTaxes: true,
    },

    method: {
        newCart: false,
    },

    init() {
        ACC.checkoutPreValid.changeOptionDate();
        ACC.checkoutPreValid.checkRadioBtn();
        ACC.checkoutPreValid.addRadioHandler();
        ACC.checkoutPreValid.checkPaymentMethod('newCard');
    },

    checkRadioBtn() {
        $.each($('.c-radiobtn__input'), (index, input) => {
            if ($(input).is(':checked')) {
                const parent = $(input).closest('.c-radiobtn');
                const method = parent.data('radio');

                ACC.checkoutPreValid.checkPaymentMethod(method);
            }
        });
    },

    addRadioHandler() {
        $('.c-radiobtn__input').on('change', function () {
            const parent = $(this).closest('.c-radiobtn');
            const method = parent.data('radio');

            ACC.checkoutPreValid.checkPaymentMethod(method);
        });
    },

    checkPaymentMethod(method) {
        switch (method) {
        case 'newCard':
            ACC.checkoutPreValid.addNewCardHandler(ACC.checkoutPreValid.state);
            ACC.checkoutPreValid.addInputTermsHandler();
            ACC.checkoutPreValid.togglePlaceBtn('newCard');
            ACC.checkoutPreValid.method.newCart = true;
            break;
        case 'savedCard':
            ACC.checkoutPreValid.destroyEvents();
            ACC.checkoutPreValid.addSavedCardHandler(ACC.checkoutPreValid.state);
            ACC.checkoutPreValid.setCvvState(ACC.checkoutPreValid.state);
            ACC.checkoutPreValid.togglePlaceBtn('savedCard');
            ACC.checkoutPreValid.method.newCart = false;
            break;
        case 'applePay':
            ACC.checkoutPreValid.destroyEvents();
            ACC.checkoutPreValid.method.newCart = false;
            ACC.applePayHelpers.showApplePayBlock();
            break;
        case 'paypal':
        default:
            ACC.checkoutPreValid.addInputTermsHandler();
            ACC.checkoutPreValid.destroyEvents();
            ACC.checkoutPreValid.method.newCart = false;
            ACC.applePayHelpers.hideApplePayBlock();
        }
    },

    areFormFieldsSet() {
        return ACC.secureacceptance.billingInfoFieldsSetCheck()
            && ACC.secureacceptance.paymentInfoFieldsSetCheck();
    },

    addNewCardHandler(state) {
        $('#card_accountNumber').on('keyup.validate', function () {
            const isValidCard = ACC.checkoutPreValid.validateInput($(this));
            state.newCard.cardNumber = isValidCard;
            ACC.checkoutPreValid.togglePlaceBtn('newCard');
        });

        $('#ExpiryMonth').on('change.validate', function () {
            const isValidSelect = ACC.checkoutPreValid.validateSelectValue($(this));
            state.newCard.expireMonth = isValidSelect;
            ACC.checkoutPreValid.togglePlaceBtn('newCard');
        });

        $('#ExpiryYear').on('change.validate', function () {
            const isValidSelect = ACC.checkoutPreValid.validateSelectValue($(this));
            state.newCard.expireYear = isValidSelect;
            ACC.checkoutPreValid.togglePlaceBtn('newCard');
        });

        $('#card_cvNumber').on('keyup.validate', function () {
            const isValidCvv = ACC.checkoutPreValid.validateInput($(this));
            state.newCard.cvv = isValidCvv;
            ACC.checkoutPreValid.togglePlaceBtn('newCard');
        });
    },

    addInputTermsHandler() {
        $('#Terms1').on('change.validate', () => {
            const isChecked = ACC.checkoutPreValid.termsAndConditionsChecked();
            ACC.checkoutPreValid.state.terms = isChecked;
            if (ACC.checkoutPreValid.method.newCart === true) {
                ACC.checkoutPreValid.togglePlaceBtn('newCard');
            }
        });
    },

    addSavedCardHandler(state) {
        $("input[id^='savedCardCvvNumber']").on('keyup.validate', function () {
            const isValidCvv = ACC.checkoutPreValid.validateInput($(this));
            state.savedCard.cvv = isValidCvv;
            ACC.checkoutPreValid.togglePlaceBtn('savedCard');
        });

        $('#Terms1').on('change.validate', () => {
            const isChecked = ACC.checkoutPreValid.termsAndConditionsChecked();
            ACC.checkoutPreValid.state.terms = isChecked;
            ACC.checkoutPreValid.togglePlaceBtn('savedCard');
        });
    },

    destroyEvents() {
        $('.checkout .c-tabs-content__wrapper').find('.input').off('.validate');
        $('#placeOrder').removeAttr('disabled aria-disabled');
    },

    setCvvState(state) {
        const $input = $('.c-saved-card.selected').find('.input');
        const isValidCvv = ACC.checkoutPreValid.validateInput($input);
        state.savedCard.cvv = isValidCvv;
    },

    togglePlaceBtn(card) {
        let isValid = true;
        $('#placeOrder').removeClass('processing');

        // Check inputs for desired card
        $.each(ACC.checkoutPreValid.state[card], (key, value) => {
            if (value === false) {
                isValid = false;
            }
        });

        // Check Terms & cond
        if (!ACC.checkoutPreValid.state.terms) {
            isValid = false;
        }

        // Check Tax recalculation
        if (!ACC.checkoutPreValid.state.hasCalculatedTaxes) {
            isValid = false;
        }

        // Enable/disable Place order button depend on validation result
        if (isValid && (ACC.checkoutPreValid.areFormFieldsSet() || ACC.secureacceptance.isCardSaved())) {
            $('.place-order-form #placeOrder').attr('aria-disabled', 'false').removeClass('button-disabled');
            return ACC.buttonhelper.enable('.place-order-form #placeOrder');
        }
        const placeOrderMsg = $('.place-order-form #placeOrder').data('enabled-message');
        return ACC.buttonhelper.ariaDisable('.place-order-form #placeOrder', placeOrderMsg);
    },

    getCardState() {
        return (ACC.checkoutPreValid.method.newCart) ? 'newCard' : 'savedCard';
    },

    validateInput($input) {
        return !!$input.val().length;
    },

    validateSelectValue($select) {
        return !!$select.find('option:selected').val();
    },

    termsAndConditionsChecked() {
        return $('#Terms1').is(':checked');
    },

    changeOptionDate() {
        if (window.matchMedia('(max-width: 767px)').matches) {
            $('.js-select-option').removeAttr('selected').remove();
            $('.js-select-option__mobile').attr('selected', 'true');
        }
        if (window.matchMedia('(min-width: 768px)').matches) {
            $('.js-select-option__mobile').removeAttr('selected').remove();
        }
    },
};
