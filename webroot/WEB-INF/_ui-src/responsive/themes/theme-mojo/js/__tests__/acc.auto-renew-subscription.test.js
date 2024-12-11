require('../account-subscription/acc.auto-renew-subscription');
require('../account-subscription/acc.subscription-helpers');
require('../acc.cookie');
require('../../../../lib/common/jquery/jquery.currencies.min');

describe('Add test for acc.auto-renew-subscription.js file', () => {
    ACC.config.encodedContextPath = '/store/en-us/pearsonplus';
    const autoRenewButton = `
        <button
            type="button"
            class="js-handler-auto-renew-modal"
        >
            Buy auto-renewing subscription
        </button>
    `;
    const autoRenewOnModal = (autoRenewVal = true, isBookstore = false) => `
        <div id="cboxLoadedContent">
            <div
                id="autoRenewOn"
                class="auto-renew-modal auto-renew-modal--on"
            >
                <div class="c-cart-voucher toggle-block">
                    <button
                        class="toggle-block-opener c-cart-voucher__label"
                        type="button"
                        id="promoCodeRenew"
                    >
                        Promo code
                    </button>
                </div>
                <form
                    id="updateSubscriptionAutoRenewalForm"
                    action="/store/en-us/pearsonplus/account/subscription/autorenew"
                    method="post"
                    >
                    <input type="hidden" name="subscriptionNumber" value="fcce52aa960c421c89059be755e3deeb_oYcwscRM">
                    <input type="hidden" name="autorenew" value=${autoRenewVal}>
                    <button
                        class="button--primary button--block"
                        data-is-bookstore-autorenew=${isBookstore}
                        aria-label="Extend your subscription with auto-renew">
                           Buy auto-renewing subscription
                    </button>
                    <div>
                        <input type="hidden" name="CSRFToken" value="cdeaf6a0-1af3-4089-a68b-9285724285fe">
                    </div>
                </form>
            </div>
        </div>
    `;
    const codeRenew = `
        <input id="product-code-renew" name="productCode" type="hidden" value="mojo_basic_monthly">
    `;
    const successModal = `
        <div id="auto-renew-on-confirmation" class="display-none">
            <div
                id="popup_auto_renew_on_confirmation"
                class="popup_upgrade_subscription popup_confirmation popup_auto_renew_confirmation"
            >
                success modal content
            </div>
        </div>
    `;
    const globalMessage = {
        globalMessages: [{
            messageHolder: 'accConfMsgsInline',
            messages: ['text.account.subscription.update'],
        }],
    };
    const location = {
        ...window.location,
        search: '?foo=bar&test=01&autorenew_subscription=true',
    };
    Object.defineProperty(window, 'location', {
        writable: true,
        value: location,
    });

    afterEach(() => {
        document.body.innerHTML = '';
        $modal.open = jest.fn();
        $modal.close = jest.fn();
        $.cookie('delayedGlobalMessage', null);
        jest.clearAllMocks();
    });

    test('get url params if url has required params', () => {
        const params = ACC.subscriptionHelpers.getUrlParam();
        expect(params.has('autorenew_subscription')).toBeTruthy();
        expect(location.search).toBe('?foo=bar&test=01&autorenew_subscription=true');
    });
    test('should open auto-renew modal if url has required params', () => {
        document.body.innerHTML = `${autoRenewButton}${autoRenewOnModal()}${codeRenew}`;
        ACC.autoRenewSubscription.checkUrlParamForAutoRenew();
        expect($modal.open).toHaveBeenCalled();
    });
    test('should not to open auto-renew modal if url has not required params', () => {
        const windowLocation = {
            ...location,
            search: '?foo=bar&test=01',
        };
        Object.defineProperty(window, 'location', {
            writable: true,
            value: windowLocation,
        });
        document.body.innerHTML = `${autoRenewButton}${autoRenewOnModal()}${codeRenew}`;
        ACC.autoRenewSubscription.checkUrlParamForAutoRenew();
        expect($modal.open).not.toHaveBeenCalled();
    });

    test('should open auto-renew modal after clicking auto-renew button', () => {
        document.body.innerHTML = `${autoRenewButton}${autoRenewOnModal()}${codeRenew}`;
        const button = document.querySelector('.js-handler-auto-renew-modal');
        ACC.autoRenewSubscription.showAutoRenewModal();
        button.click();
        const autoRenewModal = jest.spyOn($modal, 'open');
        expect(autoRenewModal).toHaveBeenCalled();
    });

    test('should load auto-renew promotion', () => {
        document.body.innerHTML = `${autoRenewButton}${autoRenewOnModal()}${codeRenew}`;
        const button = document.querySelector('.js-handler-auto-renew-modal');
        ACC.config.isApplyAutoRenewPromoCodeEnabled = true;
        ACC.cart = {
            performAutorenewVoucherCall: jest.fn(),
        };
        const loadPromotion = jest.spyOn(ACC.autoRenewSubscription, 'loadAutoRenewPromotion');
        const voucherCall = jest.spyOn(ACC.cart, 'performAutorenewVoucherCall');
        const codeValidate = jest.spyOn(ACC.subscriptionHelpers, 'validateVoucherCodeTextInput');
        const removeClass = jest.spyOn(ACC.autoRenewSubscription, 'removeHiddenClass');
        const url = `${ACC.config.encodedContextPath}/voucher/autorenew/promo/load`;
        const data = { productCode: 'mojo_basic_monthly' };
        const cartVoucher = document.querySelector('.c-cart-voucher');

        $modal.open = jest.fn((element, obj) => {
            obj.onOpen();
            obj.onLoad();
        });
        ACC.autoRenewSubscription.showAutoRenewModal();
        button.click();
        expect(cartVoucher.classList.contains('hidden-block')).toBeFalsy();
        expect($modal.open).toHaveBeenCalled();
        expect(loadPromotion).toHaveBeenCalled();
        expect(voucherCall).toBeCalledWith(url, data);
        expect(codeValidate).toHaveBeenCalled();
        expect(removeClass).toHaveBeenCalled();
        expect(cartVoucher.classList.contains('hidden-block')).toBeFalsy();
    });

    test('should show auto-renew success modal in happy flow auto-renew process', () => {
        document.body.innerHTML = `${autoRenewOnModal(true, false)}${successModal}`;
        const showAutoRenewSuccessModal = jest.spyOn(ACC.autoRenewSubscription, 'showAutoRenewOnConfirmationModal');
        const form = document.querySelector('#updateSubscriptionAutoRenewalForm');
        const buyAutoRenew = form.querySelector('button');
        const autoRenewSuccessModal = jest.spyOn($modal, 'open');

        $.post = jest.fn().mockImplementation((options) => {
            options.success();
        });
        ACC.autoRenewSubscription.showAutoRenewModal();

        $(buyAutoRenew).click();
        expect(buyAutoRenew).toBeTruthy();
        expect($.post).toHaveBeenCalled();
        expect(showAutoRenewSuccessModal).toHaveBeenCalled();
        expect(autoRenewSuccessModal).toHaveBeenCalled();
    });

    test('should set cookie and redirect user if auto-renew val is false', () => {
        document.body.innerHTML = `${globalMessage}${autoRenewOnModal(false, false)}`;
        const form = document.querySelector('#updateSubscriptionAutoRenewalForm');
        const data = '/path';
        const buyAutoRenew = form.querySelector('button');

        $.post = jest.fn().mockImplementation((options) => {
            options.success(data);
        });
        ACC.autoRenewSubscription.showAutoRenewModal();

        $(buyAutoRenew).click();
        expect($.cookie('delayedGlobalMessage')).toBe(JSON.stringify(globalMessage));
        expect(window.location.href).toBe('/store/en-us/pearsonplus/path');
    });

    test('should redirect user after auto-renew process in bookstore flow', () => {
        document.body.innerHTML = `${autoRenewOnModal(false, true)}`;
        const form = document.querySelector('#updateSubscriptionAutoRenewalForm');
        const data = '/path';
        const buyAutoRenew = form.querySelector('button');

        $.post = jest.fn().mockImplementation((options) => {
            options.success(data);
        });
        ACC.autoRenewSubscription.showAutoRenewModal();

        $(buyAutoRenew).click();
        expect(window.location.href).toBe('/store/en-us/pearsonplus/path');
    });

    test('should show global message in case of error during auto-renew process', () => {
        document.body.innerHTML = `${autoRenewOnModal}${successModal}`;
        const form = document.querySelector('#updateSubscriptionAutoRenewalForm');
        const buyAutoRenew = form.querySelector('button');
        $modal.close = jest.fn();
        const modalClose = jest.spyOn($modal, 'close');
        ACC.globalmessages = {
            callErrorGlobalMessage: jest.fn(),
        };
        const callErrorGlobalMessage = jest.spyOn(ACC.globalmessages, 'callErrorGlobalMessage');
        const data = {
            responseJSON: 'error',
        };

        $.post = jest.fn().mockImplementation((options) => {
            options.error(data);
        });
        ACC.autoRenewSubscription.showAutoRenewModal();

        $(buyAutoRenew).click();
        expect(modalClose).toHaveBeenCalled();
        expect(callErrorGlobalMessage).toHaveBeenCalledWith(data.responseJSON);
    });
});
