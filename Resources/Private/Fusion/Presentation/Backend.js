const NAMESPACE = 'carbon-slider-wrapper';
const BACKEND_EDIT_CLASS = NAMESPACE + '--edit';
[...document.querySelectorAll('.' + NAMESPACE)].forEach((element) => {
  const BUTTON = element.querySelector(`.${NAMESPACE}__switcher`);
  const LIVE = element.querySelector(`.${NAMESPACE}__live`);
  if (BUTTON) {
    BUTTON.addEventListener('click', () => {
      if (element.classList.contains(BACKEND_EDIT_CLASS)) {
        window.location.reload();
        return;
      }
      if (LIVE) {
        LIVE.remove();
      }
      element.classList.add(BACKEND_EDIT_CLASS);
    });
  }
});
