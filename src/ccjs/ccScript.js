const hamburger = document.getElementById("hamburger");
const sideMenu = document.getElementById("sideMenu");
const overlay = document.getElementById("overlay");
const navLinks = document.getElementById("navLinks");
const mobileNavLinks = document.getElementById("mobileNavLinks");

function toggleMenu() {
  hamburger.classList.toggle("active");
  sideMenu.classList.toggle("open");
  overlay.classList.toggle("show");
}

hamburger.addEventListener("click", toggleMenu);
overlay.addEventListener("click", toggleMenu);

// Move nav links into mobile area
function moveNavLinks() {
  if (window.innerWidth <= 768) {
    if (mobileNavLinks.childElementCount === 0) {

      // Clone nav links
      const clone = navLinks.cloneNode(true);

      // Reverse order
      const linksArray = Array.from(clone.children).reverse();

      // Append reversed
      mobileNavLinks.append(...linksArray);
    }
  }
}

moveNavLinks();
window.addEventListener("resize", moveNavLinks);

const dropdownTrigger = document.querySelector(".dropdown-trigger");
const dropdownMenu = document.querySelector(".dropdown-menu");

dropdownTrigger.addEventListener("click", () => {
    dropdownMenu.classList.toggle("show");
});