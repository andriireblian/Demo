ACC.cartvoucher = {
    _autoload: [
        ['init', $('.toggle-block')],
    ],
    config: {
        testAnimate: false,
        SPACEBAR_KEY_CODE: 32,
        ENTER_KEY_CODE: 13,
        animationSpeed: 400,
    },
    objects: {
        holders: $('.toggle-block'),
    },
    selector: {
        holder: '.toggle-block',
        blockOpener: '.toggle-block-opener',
        blockArea: '.toggle-block-area',
        activeClassName: 'active',
    },

    init() {
        ACC.cartvoucher.toggleBlock();
        ACC.cartvoucher.bind();
    },

    toggleBlock() {
        const { selector } = ACC.cartvoucher;
        const holders = $(selector.holder);

        holders.each(function () {
            // default options
            const holder = $(this);
            const slide = holder.find(selector.blockArea).hide();
            if (holder.is(`.${selector.activeClassName}`)) {
                slide.show();
            }
        });
    },

    clickHandler(element) {
        const { selector } = ACC.cartvoucher;
        const { config } = ACC.cartvoucher;
        const holder = $(element).closest(selector.holder);
        const slide = holder.find(selector.blockArea);

        if (!config.testAnimate) {
            config.testAnimate = true;
            if (holder.hasClass(selector.activeClassName)) {
                holder.removeClass(selector.activeClassName);
                slide.slideUp(config.animationSpeed, () => {
                    config.testAnimate = false;
                });
            } else {
                holder.addClass(selector.activeClassName);
                slide.slideDown(config.animationSpeed, () => {
                    config.testAnimate = false;
                });
            }
        }
    },
    bind() {
        const { selector } = ACC.cartvoucher;
        const { config } = ACC.cartvoucher;
        // attach events
        $(document).on('click', selector.blockOpener, (e) => {
            ACC.cartvoucher.clickHandler(e.currentTarget);
            ACC.cartvoucher.toggleAriaExpandedAttr(e.currentTarget);
        });

        $(document).on('keydown', selector.blockOpener, (e) => {
            const openDropDown = e.keyCode === config.SPACEBAR_KEY_CODE || e.keyCode === config.ENTER_KEY_CODE;
            if (openDropDown) {
                ACC.cartvoucher.clickHandler(e.currentTarget);
                ACC.cartvoucher.toggleAriaExpandedAttr(e.currentTarget);
            }
        });
    },

    toggleAriaExpandedAttr(element) {
        const attr = $(element).attr('aria-expanded');
        $(element).attr('aria-expanded', attr === 'false' ? 'true' : 'false');
    },

    showSuccessMessage(message) {
        const element = $(ACC.cartvoucher.selector.blockOpener);
        const holder = $(element).closest(ACC.cartvoucher.selector.holder);
        const slide = holder.find(ACC.cartvoucher.selector.blockArea);
        $('#promo-code-success').html(message);
        holder.addClass(ACC.cartvoucher.selector.activeClassName);
        slide.slideDown(ACC.cartvoucher.config.animationSpeed, () => {
            ACC.cartvoucher.config.testAnimate = false;
        });
    },

    openVoucherOnLoad(voucherBlock) {
        if (voucherBlock) {
            voucherBlock.classList.remove(ACC.cartvoucher.selector.activeClassName);
            const voucherOpener = voucherBlock.querySelector(ACC.cartvoucher.selector.blockOpener);
            ACC.cartvoucher.clickHandler(voucherOpener);
            ACC.cartvoucher.toggleAriaExpandedAttr(voucherOpener);
        }
    },
};
