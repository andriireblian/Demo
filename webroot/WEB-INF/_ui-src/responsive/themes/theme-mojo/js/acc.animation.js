ACC.animation = {

    _autoload: [
        'init',
    ],

    init() {
        ACC.animation.addScrollHandler();
    },

    addScrollHandler() {
        if (window.IntersectionObserver) {
            const activeClass = 'in-view';
            const intersectionObserver = new IntersectionObserver(((entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add(activeClass);
                        observer.unobserve(entry.target);
                    }
                });
            }), { rootMargin: '0px 0px -20% 0px' });

            document.querySelectorAll('.animated').forEach((el) => {
                intersectionObserver.observe(el);
            });
        }
    },
};
