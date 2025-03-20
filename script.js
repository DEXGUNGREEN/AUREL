document.addEventListener("DOMContentLoaded", function () {
    let details = document.getElementById("defl1");
    let elementACacher = document.getElementById("defl2");

    details.addEventListener("toggle", function () {
        elementACacher.style.display = this.open ? "none" : "inline";
    });
});