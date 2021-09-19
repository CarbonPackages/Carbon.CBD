import Glide from "@glidejs/glide";

[...document.querySelectorAll(".slider")].forEach((element) => {
    const select = element.querySelector(".slider__select");
    const slider = element.querySelector(".glide");
    const settings = JSON.parse(slider.dataset?.glide || null);
    const glide = new Glide(slider, {
        type: select.value,
        ...settings,
    });
    select.addEventListener("change", (event) => {
        glide.update({
            type: event.target.value,
        });
    });
    glide.mount();
});
