const BACKEND_EDIT_CLASS = "carbon-slider-wrapper--edit";
[...document.querySelectorAll(".carbon-slider-wrapper")].forEach((element) => {
    const BUTTON = element.querySelector(".carbon-slider-wrapper__switcher");
    if (BUTTON) {
        BUTTON.addEventListener("click", () => {
            if (element.classList.contains(BACKEND_EDIT_CLASS)) {
                window.location.reload();
            } else {
                element.classList.add(BACKEND_EDIT_CLASS);
            }
        });
    }
});
