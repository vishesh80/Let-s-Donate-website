const burger = document.getElementById("burger");
const menudiv = document.getElementById("rnav");

burger.addEventListener("click", event => {

    console.log("clicked");
    menudiv.classList.toggle("toggle");
    event.stopPropagation();
});

window.addEventListener("click", event => {

    menudiv.classList.remove("toggle");
});
window.addEventListener("resize", event => {

    menudiv.classList.remove("toggle");
});