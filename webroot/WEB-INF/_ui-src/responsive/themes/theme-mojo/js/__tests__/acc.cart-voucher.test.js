require('../acc.cart-voucher');

describe('tests for cart voucher', () => {
    let holder;
    let slide;
    let blockOpener;

    beforeEach(() => {
        document.body.innerHTML = `
            <div class="toggle-block">
                <button class="toggle-block-opener" type="button" aria-expanded="false">
                    Promo code
                </button>
                <div class="toggle-block-area" id="promoCodeEntry"></div>
            </div>
        `;
        holder = $('.toggle-block');
        slide = holder.find(ACC.cartvoucher.selector.blockArea);
        blockOpener = holder.find(ACC.cartvoucher.selector.blockOpener);
    });

    afterEach(() => {
        document.body.innerHTML = '';
        jest.clearAllMocks();
    });

    test('test calling methods on init', () => {
        const toggleBlock = jest.spyOn(ACC.cartvoucher, 'toggleBlock');
        const bind = jest.spyOn(ACC.cartvoucher, 'bind');

        ACC.cartvoucher.init();

        expect(toggleBlock).toHaveBeenCalled();
        expect(bind).toHaveBeenCalled();
    });

    test('test hiding of toggleBlock', () => {
        ACC.cartvoucher.toggleBlock();

        expect(slide.css('display')).toEqual('none');
    });

    test('test showing of toggleBlock', () => {
        holder.addClass(ACC.cartvoucher.selector.activeClassName);

        ACC.cartvoucher.toggleBlock();

        expect(slide.css('display')).toEqual('block');
    });

    test('test adding active class on clickHandler', () => {
        const spySlideDown = jest.spyOn($.fn, 'slideDown');

        ACC.cartvoucher.clickHandler(blockOpener);

        expect(holder.hasClass(ACC.cartvoucher.selector.activeClassName)).toBeTruthy();
        expect(spySlideDown).toHaveBeenCalledWith(ACC.cartvoucher.config.animationSpeed, expect.any(Function));
    });

    test('test removing active class on clickHandler', () => {
        holder.addClass(ACC.cartvoucher.selector.activeClassName);
        const spySlideUp = jest.spyOn($.fn, 'slideUp');

        ACC.cartvoucher.clickHandler(blockOpener);

        expect(holder.hasClass(ACC.cartvoucher.selector.activeClassName)).toBeFalsy();
        expect(spySlideUp).toHaveBeenCalledWith(ACC.cartvoucher.config.animationSpeed, expect.any(Function));
    });

    test('test calling methods on click in bind method', () => {
        const clickHandler = jest.spyOn(ACC.cartvoucher, 'clickHandler');
        const toggleAriaExpandedAttr = jest.spyOn(ACC.cartvoucher, 'toggleAriaExpandedAttr');

        ACC.cartvoucher.bind();

        $(ACC.cartvoucher.selector.blockOpener).trigger('click');

        expect(clickHandler).toHaveBeenCalled();
        expect(toggleAriaExpandedAttr).toHaveBeenCalled();
    });

    test('test calling methods on pressing enter key in bind method', () => {
        const clickHandler = jest.spyOn(ACC.cartvoucher, 'clickHandler');
        const toggleAriaExpandedAttr = jest.spyOn(ACC.cartvoucher, 'toggleAriaExpandedAttr');

        ACC.cartvoucher.bind();

        const keyDownEvent = jQuery.Event('keydown', { which: 13, keyCode: 13 });
        $(ACC.cartvoucher.selector.blockOpener).trigger(keyDownEvent);

        expect(clickHandler).toHaveBeenCalled();
        expect(toggleAriaExpandedAttr).toHaveBeenCalled();
    });

    test('test not calling methods on pressing any key except enter and space keys in bind method', () => {
        const clickHandler = jest.spyOn(ACC.cartvoucher, 'clickHandler');
        const toggleAriaExpandedAttr = jest.spyOn(ACC.cartvoucher, 'toggleAriaExpandedAttr');

        ACC.cartvoucher.bind();

        const keyDownEvent = jQuery.Event('keydown', { which: 74, keyCode: 74 });
        $(ACC.cartvoucher.selector.blockOpener).trigger(keyDownEvent);

        expect(clickHandler).not.toHaveBeenCalled();
        expect(toggleAriaExpandedAttr).not.toHaveBeenCalled();
    });

    test('test adding attribute aria-expanded', () => {
        ACC.cartvoucher.toggleAriaExpandedAttr($(ACC.cartvoucher.selector.blockOpener));

        expect($(ACC.cartvoucher.selector.blockOpener).attr('aria-expanded')).toBeTruthy();
    });
});
