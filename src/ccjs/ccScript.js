/* ================================
   LOAD HTML PARTIALS (navbar, sidemenu, footer)
================================ */
document.addEventListener("DOMContentLoaded", () => {
    const includes = document.querySelectorAll("[data-include]");

    includes.forEach(async (el) => {
        const file = el.getAttribute("data-include");
        const response = await fetch(file);
        const html = await response.text();

        el.innerHTML = html;

        // INITIALIZE ONLY WHAT LOADED
        if (file.includes("navbar")) initNavbar();
        if (file.includes("sidemenu")) initSideMenu();
        if (file.includes("footer")) {} // no footer JS needed
    });
});


/* ================================
   GLOBAL FUNCTIONS
================================ */

// Toggle open/close for side menu
function toggleMenu() {
    const hamburger = document.getElementById("hamburger");
    const sideMenu = document.getElementById("sideMenu");
    const overlay = document.getElementById("overlay");

    hamburger.classList.toggle("active");
    sideMenu.classList.toggle("open");
    overlay.classList.toggle("show");
}

// Moves navbar links → into mobile menu
function moveNavLinks() {
    const navLinks = document.getElementById("navLinks");
    const mobileNavLinks = document.getElementById("mobileNavLinks");

    if (!navLinks || !mobileNavLinks) return;
    if (window.innerWidth > 768) return;

    // Only add once
    if (mobileNavLinks.childElementCount === 0) {
        const clone = navLinks.cloneNode(true);
        const reversed = Array.from(clone.children).reverse();
        mobileNavLinks.append(...reversed);
    }
}


/* ================================
   NAVBAR INITIALIZATION
================================ */
function initNavbar() {
    const hamburger = document.getElementById("hamburger");
    const overlay = document.getElementById("overlay");

    if (!hamburger || !overlay) return;

    hamburger.addEventListener("click", toggleMenu);
    overlay.addEventListener("click", toggleMenu);
}


/* ================================
   SIDE MENU INITIALIZATION
================================ */
function initSideMenu() {
    moveNavLinks();
    window.addEventListener("resize", moveNavLinks);

    // Dropdown
    const dropdownTrigger = document.querySelector(".dropdown-trigger");
    const dropdownMenu = document.querySelector(".dropdown-menu");

    if (dropdownTrigger && dropdownMenu) {
        dropdownTrigger.addEventListener("click", () => {
            dropdownMenu.classList.toggle("show");
        });
    }

    initSwipeMenu();
}


