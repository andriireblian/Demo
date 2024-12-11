var cartVoucher = (function() {
    var _config = {
        testAnimate: false,
        SPACEBAR_KEY_CODE: 32,
        ENTER_KEY_CODE: 13,
        animationSpeed: 400,
    }

    var selector = {
        holder: '.toggle-block',
        blockOpener: '.toggle-block-opener',
        blockArea: '.toggle-block-area',
        activeClassName: 'active'
    }

    function init() {
        bind();
        toggleBlock()
    }

    function toggleBlock () {
        var holders = $(selector.holder);

        holders.each( function () {
            // default options
            var holder = $(this);
            var slide = holder.find(selector.blockArea).hide();
            if (holder.is("." + selector.activeClassName)) {
                slide.show();
            }
        });
    }

    function clickHandler (element) {
        var holder = $(element).closest(selector.holder);
        var slide = holder.find(selector.blockArea);

        if (!_config.testAnimate) {
            _config.testAnimate = true;
            if (holder.hasClass(selector.activeClassName)) {
                holder.removeClass(selector.activeClassName);
                slide.slideUp(_config.animationSpeed, function () {
                    _config.testAnimate = false;
                });
            } else {
                holder.addClass(selector.activeClassName);
                slide.slideDown(_config.animationSpeed, function () {
                    _config.testAnimate = false;
                });
            }
        }
    }

    function validateEmptyInput (btn) {
        var empty = false;

        if ($(this).val().trim() === '') { empty = true; }

        if (empty) {
            btn.attr('disabled', 'disabled');
        } else {
            btn.removeAttr('disabled');
        }

    }

    function toggleAriaExpandedAttr (element) {
        var attr = $(element).attr("aria-expanded");

        $(element).attr("aria-expanded", attr === "false" ? "true" : "false");
    }

    function setPromoCodeRemovedMsg () {
        var promoRemoveMsgHolder = $('#promo-removed-msg');
        var removeMsg = promoRemoveMsgHolder.attr('data-label');
        promoRemoveMsgHolder.html(removeMsg);
    }

    function bind() {
        var applyBtn = $('#js-voucher-apply-btn');
        var input = $('#js-voucher-code-text');

        input.on('input', function() {
            validateEmptyInput.call(this, applyBtn)
        });

        $(document).on('click', selector.blockOpener, function (e) {
            clickHandler(e.currentTarget);
            toggleAriaExpandedAttr(e.currentTarget);
        });

        $(document).on('keydown', selector.blockOpener, function (e) {
            var openDropDown = e.keyCode === _config.SPACEBAR_KEY_CODE || e.keyCode === _config.ENTER_KEY_CODE;
            if (openDropDown) {
                clickHandler(e.currentTarget);
                toggleAriaExpandedAttr(e.currentTarget);
            }
        });
    }

    return  {
        init
    }
})();

cartVoucher.init()
