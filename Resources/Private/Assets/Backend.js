const NAMESPACE = "carbon-cbd";
const BACKEND_EDIT_CLASS = NAMESPACE + "--edit";
[...document.querySelectorAll("." + NAMESPACE)].forEach((element) => {
    const BUTTON = element.querySelector(`.${NAMESPACE}__switcher`);
    const LIVE = element.querySelector(`.${NAMESPACE}__live`);
    const type = element.dataset.type;
    if (BUTTON) {
        BUTTON.addEventListener("click", () => {
            if (element.classList.contains(BACKEND_EDIT_CLASS)) {
                window.location.reload();
                triggerEvent({ mode: "live", element, type });
                return;
            }
            if (LIVE) {
                setTimeout(() => {
                    LIVE.remove();
                }, 10);
            }
            element.classList.add(BACKEND_EDIT_CLASS);
            triggerEvent({ mode: "edit", element, type });
        });
    }
});

const triggerEvent = (options) => {
    setTimeout(() => {
        let event;
        if (!options) {
            options = {};
        }
        if (window.CustomEvent) {
            event = new CustomEvent("carbonCBD", { detail: options });
        } else {
            event = document.createEvent("CustomEvent");
            event.initCustomEvent("carbonCBD", true, true, options);
        }
        document.dispatchEvent(event);
    }, 20);
};
