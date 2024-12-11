/** ###########################################################################################################
 ###########################################################################################################

 Modals Functionality

 ----------------------------------------------------------------------------------------------------------
 Dependency:
 - Colorbox modal plugin ( v1.6.4 )

 This functionality is used as abstraction layer between any third party library for modals
 and usage of modals in our store/templates.

 That way we can easy replace any library without readjustement in all .js/.jsp files.

 ----------------------------------------------------------------------------------------------------------
 Usage:
 - Attach "data-modal-title" and "data-modal-content" attributes to button that triggers modal opening
 - Open: Inside .js trigger modal open function with clicked element passed as parameter => "$modal.open(clickedEl)"
 - Close: Inside .js trigger modal close function without any parameters => "$modal.close()""

 */

// ###########################################################################################################
// Colorbox library global settings
const COLORBOX = {
    className: 'isHidden',
    opacity: 0.85,
    close: false,
    fixed: true,
    reposition: false,
    transition: 'none',
    top: '0',
    left: '0',
    data: true,
    title() {
        // Return title element
        return '<h4 class="headline"><span class="headline-text"></span></h4>';
    },
    html() {
        // Get modal content data from element
        const htmlContent = $.colorbox.element()[0].dataset.modalContent;
        // If value has is ID of the element, return this as $ object
        if (htmlContent && htmlContent[0] === '#') {
            // Copy content with all events ( true flag in clone method )
            const contentCopy = $(htmlContent).clone(true);
            return $(contentCopy);
        }
        // Else return it as string wrapped in DIV container
        return htmlContent ? `<div><p>${htmlContent}</p></div>` : '';
    },

    onOpen() {},

    onLoad() {},

    onComplete() {
        const colorBoxModal = document.querySelectorAll('#colorbox')[0];
        const cboxContent = colorBoxModal.querySelector('#cboxContent');
        const cboxTitle = cboxContent.querySelector('#cboxTitle');
        const { modalTitle } = $.colorbox.element()[0].dataset;
        const modalLabel = $.colorbox.element()[0].getAttribute('aria-label');
        const modalCloseBtn = colorBoxModal.querySelector('#cboxClose');
        const main = document.querySelector('main');
        let cboxModalTitle;
        let cboxDescription;
        let focusableEl;
        if (ACC.utils.isMojoTheme()) {
            cboxModalTitle = cboxContent.querySelector('.cboxModalTitle');
            cboxDescription = cboxContent.querySelector('.cboxDescription');
            focusableEl = cboxContent.querySelector('.focusable-element');
            // prevent scroll
            document.querySelector('body').setAttribute('style', 'overflow:hidden;');

            if (!focusableEl) {
                /* global PearsonKeyboardTrap */
                const keyboardTrap = new PearsonKeyboardTrap(cboxContent);
                const focusableEls = keyboardTrap.getFocusableEls(document.querySelector('#cboxLoadedContent'));
                // set focus for close btn or first focusable element
                if (focusableEls.length) {
                    focusableEls[0].focus();

                    if ($.colorbox.arguments && !($.colorbox.arguments[0].keyboardInteraction)) {
                        colorBoxModal.classList.add('focus-first-interactive-element');

                        focusableEls[0].addEventListener('focusout', () => {
                            colorBoxModal.classList.remove('focus-first-interactive-element');
                        });

                        window.addEventListener('blur', () => {
                            colorBoxModal.classList.add('focus-first-interactive-element');
                        });
                    }
                } else {
                    modalCloseBtn.focus();
                }
            } else {
                // Initial focus is set on the first paragraph because the first interactive element is at the bottom,
                // which is out of view due to the length of the text.
                focusableEl.focus();
            }
        }
        // Hidden another content for accessibility API
        main.setAttribute('aria-hidden', 'true');

        if (cboxModalTitle) {
            colorBoxModal.setAttribute('aria-labelledby', cboxModalTitle.id);
        }

        if (cboxDescription) {
            colorBoxModal.setAttribute('aria-describedby', cboxDescription.id);
        }

        if (modalLabel) {
            colorBoxModal.setAttribute('aria-label', modalLabel);
        }
        colorBoxModal.setAttribute('aria-modal', true);
        if (modalCloseBtn) {
            modalCloseBtn.setAttribute('aria-label', 'Close Dialog');
        }

        if (ACC.utils.isLearnerTheme()) {
            // eslint-disable-next-line no-undef
            const keyboardTrap = new PearsonKeyboardTrap(cboxContent);
            const focusableEls = keyboardTrap.getFocusableEls(document.querySelector('#cboxLoadedContent'));
            // set focus for close btn or first focusable element
            if (focusableEls.length) {
                focusableEls[0].focus();
            } else {
                modalCloseBtn.focus();
            }
        }

        // Remove some of #colorbox default styles
        colorBoxModal.style.width = '';
        colorBoxModal.style.height = '';
        // remove unnecessary elements
        if (colorBoxModal.querySelector('#cboxSlideshow')) {
            colorBoxModal.querySelector('#cboxPrevious').remove();
            colorBoxModal.querySelector('#cboxNext').remove();
            colorBoxModal.querySelector('#cboxSlideshow').remove();
        }

        // Remove title inline styles
        cboxTitle.removeAttribute('style');

        // Remove title if content is not present
        if (modalTitle) {
            // Set title if available ( attached as data attribute to clicked element )
            cboxTitle.querySelector('.headline-text').textContent = modalTitle;
        } else if ($.colorbox.arguments && typeof $.colorbox.arguments[0].title === 'string') {
            // Set title if passed as argument while calling modals library without clicked element
            cboxTitle.innerHTML = `<h4 class="headline">
              <span class="headline-text">${$.colorbox.arguments[0].title}</span>
            </h4>`;
        } else {
            // Remove title DOM NODE if title is undefined
            cboxTitle.parentNode.removeChild(cboxTitle);
        }

        // Remove styles from one of inner divs
        colorBoxModal.querySelector('#cboxMiddleRight').removeAttribute('style');
        colorBoxModal.querySelector('#cboxMiddleLeft').removeAttribute('style');

        // Remove style attribute on #cboxWrapper & #cboxContent
        colorBoxModal.querySelector('#cboxWrapper').removeAttribute('style');
        cboxContent.removeAttribute('style');
        cboxContent.querySelector('#cboxLoadedContent').removeAttribute('style');

        // Remove hidden class ( change modal state from hidden to visible )
        setTimeout(() => {
            colorBoxModal.classList.remove('isHidden');
        }, 200);
    },

    onCleanup() {
    },

    onClosed() {
        // Show another content for accessibility API
        document.querySelector('main').removeAttribute('aria-hidden');
        if (ACC.utils.isMojoTheme()) {
            document.querySelector('body').removeAttribute('style');
        }
    },
};
if (ACC.utils.isMojoTheme()) {
    COLORBOX.keyboardInteraction = true;
}
// ###########################################################################################################
// Our functionality written as $modal class with predefined methods
// for opening and closing modal windows

// eslint-disable-next-line no-unused-vars
const $modal = (function () {
    // Open modal
    const open = function (clickedEl, content) {
        // In case of additional content that should be passed
        // exclude DOM element which brings properties such as
        let options;
        if (clickedEl === null && content) {
            // Concatenate global settings and override with our custom ( jQuery dependency )
            options = $.extend({}, COLORBOX, content);
            // and open modal with defined settings
            return $.colorbox(options);
        }

        if (clickedEl && content) {
            // Concatenate global settings and override with our custom ( jQuery dependency )
            options = $.extend({}, COLORBOX, content);
            // and open modal with defined settings
            return $(clickedEl).colorbox(options);
        }

        // In case of classic usage, just trigger modal library, attach it to DOM element
        // and pass global settings to it.
        // ( IMPORTANT: This element should have title and modal content attached as HTML 5 data attributes
        // data-modal-title and data-modal-content )
        return $(clickedEl).colorbox(COLORBOX);
    };

    // Close modal
    const close = function () {
        // Trigger modal library's internet closing method
        return $.colorbox.close();
    };

    // Return whole $modal functionality as JS Object with public methods
    // open and close mapped to private methods equivalent
    return {
        open,
        close,
    };
}());
