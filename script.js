document.addEventListener("DOMContentLoaded", function () {
    let details = document.getElementById("defl1");
    let elementACacher = document.getElementById("defl2");

    details.addEventListener("toggle", function () {
        elementACacher.style.display = this.open ? "none" : "inline";
    });
});

/* JavaScript pour le menu mobile */
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const mainNav = document.querySelector('.main-nav');

mobileMenuToggle.addEventListener('click', function() {
    mainNav.classList.toggle('active');
    if (mainNav.classList.contains('active')) {
        mobileMenuToggle.style.display = 'none'; // Masque le bouton burger
    } else {
        mobileMenuToggle.style.display = 'block'; // Affiche le bouton burger
    }
});