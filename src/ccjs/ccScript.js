

const hamburger = document.getElementById("hamburger");
const sideMenu = document.getElementById("sideMenu");
const overlay = document.getElementById("overlay");

function toggleMenu() {
  hamburger.classList.toggle("active");
  sideMenu.classList.toggle("open");
  overlay.classList.toggle("show");
}

hamburger.addEventListener("click", toggleMenu);
overlay.addEventListener("click", toggleMenu); // Close on overlay click