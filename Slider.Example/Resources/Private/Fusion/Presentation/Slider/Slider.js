[...document.querySelectorAll(".slider")].forEach((element) => {
    const select = element.querySelector(".slider__select");
    const slider = element.querySelector(".glide");
    const glide = new Glide(slider, {
        type: select.value,
        focusAt: "center",
        perView: 3,
    });
    select.addEventListener("change", (event) => {
        glide.update({
            type: event.target.value,
        });
    });
    glide.mount();
});
