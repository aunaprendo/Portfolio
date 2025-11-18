const hamburger = document.getElementById("hamburger");
const sideMenu = document.getElementById("sideMenu");
const overlay = document.getElementById("overlay");
const navLinks = document.getElementById("navLinks");
const mobileNavLinks = document.getElementById("mobileNavLinks");

function toggleMenu() {
  hamburger.classList.toggle("active");
  sideMenu.classList.toggle("open");

  // only use overlay on desktop
  if (window.innerWidth > 768) {
    overlay.classList.toggle("show");
  }
}

hamburger.addEventListener("click", toggleMenu);
overlay.addEventListener("click", toggleMenu);

// Move nav links into mobile area
function moveNavLinks() {
  if (window.innerWidth <= 768) {
    if (mobileNavLinks.childElementCount === 0) {
      mobileNavLinks.append(...navLinks.cloneNode(true).children);
    }
  }
}
moveNavLinks();
window.addEventListener("resize", moveNavLinks);