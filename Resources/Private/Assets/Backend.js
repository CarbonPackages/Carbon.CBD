document.addEventListener(
    "Neos.NodeCreated",
    (event) => {
        const element = event.detail.element;
        if (element && element.matches(".carbon-cbd--edit[data-reload]")) {
            window.location.reload();
        }
    },
    false
);

window.carbonCBDswitcher = (button) => {
    const element = button.closest(".carbon-cbd");
    const liveContainer = element.querySelector(".carbon-cbd__live");
    const type = element.dataset.type;

    if (element.classList.contains("carbon-cbd--edit")) {
        window.location.reload();
        triggerEvent({ mode: "live", element, type });
        return;
    }

    if (liveContainer) {
        setTimeout(() => {
            liveContainer.remove();
        }, 10);
    }

    element.classList.add("carbon-cbd--edit");
    triggerEvent({ mode: "edit", element, type });
};

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
