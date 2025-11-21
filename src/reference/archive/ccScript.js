/* =========================================================================
   Accessible site JS — partials loader, navbar, side-menu, dropdowns
   - 2-space indentation
   - robust, defensive, and keyboard accessible
   ========================================================================= */

document.addEventListener("DOMContentLoaded", () => {
  loadPartials();
});

/* ================================
   PARTIALS LOADER
   - injects HTML from [data-include]
   - initializes components after injection
================================ */
async function loadPartials() {
  const includes = document.querySelectorAll("[data-include]");

  for (const el of includes) {
    try {
      const file = el.getAttribute("data-include");
      if (!file) continue;

      const resp = await fetch(file);
      if (!resp.ok) {
        console.warn(`Failed to fetch ${file}: ${resp.status}`);
        continue;
      }

      const html = await resp.text();
      el.innerHTML = html;

      // normalize filename for matching (case-insensitive)
      const clean = file.toLowerCase();

      if (clean.includes("navbar")) initNavbar();
      if (clean.includes("sidemenu")) initSideMenu();
      // footer requires no JS
    } catch (err) {
      console.error("Error loading partial:", err);
    }
  }
}

/* ================================
   GLOBAL HELPERS
================================ */

/**
 * Returns an array of focusable elements inside container
 */
function getFocusable(container = document) {
  const selectors = [
    'a[href]:not([disabled])',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ];
  return Array.from(container.querySelectorAll(selectors.join(","))).filter(
    (el) => !el.hasAttribute("disabled") && isVisible(el)
  );
}

/**
 * Simple visibility check for focusable filtering
 */
function isVisible(el) {
  return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
}

/* ================================
   NAVBAR / HAMBURGER
================================ */
function initNavbar() {
  const hamburger = document.getElementById("hamburger");
  const overlay = document.getElementById("overlay");
  const sideMenu = document.getElementById("sideMenu");

  if (!hamburger || !overlay || !sideMenu) return;

  // ensure semantic/accessible attributes
  hamburger.setAttribute("role", "button");
  hamburger.setAttribute("tabindex", "0");
  hamburger.setAttribute("aria-controls", "sideMenu");
  if (!hamburger.hasAttribute("aria-expanded")) hamburger.setAttribute("aria-expanded", "false");

  // prefer click (mouse) and keydown (Enter/Space)
  const onToggle = (e) => {
    if (e.type === "keydown" && e.key !== "Enter" && e.key !== " ") return;
    toggleMenu();
  };

  hamburger.addEventListener("click", onToggle);
  hamburger.addEventListener("keydown", onToggle);

  // overlay closes menu
  overlay.addEventListener("click", closeMenu);

  // close on escape (global)
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });
}

/* Toggle wrapper */
function toggleMenu() {
  const hamburger = document.getElementById("hamburger");
  const sideMenu = document.getElementById("sideMenu");
  const overlay = document.getElementById("overlay");

  if (!hamburger || !sideMenu || !overlay) return;

  const isOpen = sideMenu.classList.toggle("open");
  hamburger.classList.toggle("active", isOpen);
  overlay.classList.toggle("show", isOpen);
  hamburger.setAttribute("aria-expanded", isOpen ? "true" : "false");

  if (isOpen) {
    openFocusTrap(sideMenu);
  } else {
    releaseFocusTrap();
  }
}

/* Explicit close */
function closeMenu() {
  const hamburger = document.getElementById("hamburger");
  const sideMenu = document.getElementById("sideMenu");
  const overlay = document.getElementById("overlay");

  if (!hamburger || !sideMenu || !overlay) return;

  sideMenu.classList.remove("open");
  hamburger.classList.remove("active");
  overlay.classList.remove("show");
  hamburger.setAttribute("aria-expanded", "false");

  releaseFocusTrap();
}

/* ================================
   MOVE NAV LINKS → MOBILE
================================ */
function moveNavLinks() {
  const navLinks = document.getElementById("navLinks");
  const mobileNavLinks = document.getElementById("mobileNavLinks");

  if (!navLinks || !mobileNavLinks) return;

  // if desktop, do nothing
  if (window.innerWidth > 768) {
    // OPTIONAL: if you want to move back to navbar on resize-up, implement here.
    return;
  }

  if (mobileNavLinks.childElementCount === 0) {
    // Clone only the list items (avoid duplicating ids or unexpected markup)
    const clone = navLinks.cloneNode(true);

    // Remove potential IDs on cloned elements to avoid duplicates
    clone.querySelectorAll("[id]").forEach((n) => n.removeAttribute("id"));

    // Reverse order if you want 'HOME' top (per earlier requests)
    const items = Array.from(clone.children).reverse();
    mobileNavLinks.append(...items);
  }
}

/* ================================
   SIDE MENU + DROPDOWNS
================================ */
function initSideMenu() {
  // Move navlinks into mobile menu if applicable and watch resize
  moveNavLinks();
  window.addEventListener("resize", moveNavLinks);

  const dropdownTriggers = Array.from(document.querySelectorAll(".dropdown-trigger"));

  // Each dropdown trigger may control a separate dropdown menu
  dropdownTriggers.forEach((trigger, index) => {
    // find the next sibling .dropdown-menu OR associated id if present
    let menu = trigger.nextElementSibling;
    if (!menu || !menu.classList.contains("dropdown-menu")) {
      // fallback by aria-controls
      const ctrl = trigger.getAttribute("aria-controls");
      if (ctrl) menu = document.getElementById(ctrl);
    }

    // If still missing, skip
    if (!menu) return;

    // Ensure attributes
    if (!trigger.hasAttribute("role")) trigger.setAttribute("role", "button");
    if (!trigger.hasAttribute("tabindex")) trigger.setAttribute("tabindex", "0");

    // assign id to menu if missing
    if (!menu.id) menu.id = `dropdown-${index + 1}`;

    trigger.setAttribute("aria-controls", menu.id);
    trigger.setAttribute("aria-expanded", "false");
    menu.setAttribute("aria-hidden", "true");
    menu.setAttribute("role", "menu");

    // toggle function
    const toggle = (e) => {
      if (e.type === "keydown" && e.key !== "Enter" && e.key !== " ") return;
      const isNowOpen = menu.classList.toggle("show");
      trigger.setAttribute("aria-expanded", isNowOpen ? "true" : "false");
      menu.setAttribute("aria-hidden", isNowOpen ? "false" : "true");
      if (isNowOpen) {
        // focus first focusable item inside menu if any
        const focusables = getFocusable(menu);
        if (focusables.length) focusables[0].focus();
      } else {
        // return focus to trigger
        trigger.focus();
      }
      e && e.preventDefault();
    };

    trigger.addEventListener("click", toggle);
    trigger.addEventListener("keydown", toggle);

    // close menu when clicking outside (but inside side-menu area it's okay)
    document.addEventListener("click", (ev) => {
      if (!menu.classList.contains("show")) return;
      // if click is inside trigger or menu, do nothing
      if (trigger.contains(ev.target) || menu.contains(ev.target)) return;
      // else close
      menu.classList.remove("show");
      trigger.setAttribute("aria-expanded", "false");
      menu.setAttribute("aria-hidden", "true");
    });

    // also close with Escape
    document.addEventListener("keydown", (ev) => {
      if (ev.key !== "Escape") return;
      if (menu.classList.contains("show")) {
        menu.classList.remove("show");
        trigger.setAttribute("aria-expanded", "false");
        menu.setAttribute("aria-hidden", "true");
        trigger.focus();
      }
    });
  });
}

/* ================================
   FOCUS TRAP (while side-menu open)
   - simple implementation: keep Tab inside the side-menu
================================ */

let _previouslyFocused = null;
let _trapContainer = null;
let _trapHandler = null;

function openFocusTrap(container) {
  if (!container) return;
  _trapContainer = container;
  _previouslyFocused = document.activeElement;

  const focusables = getFocusable(container);
  if (focusables.length) focusables[0].focus();

  _trapHandler = (e) => {
    if (e.key !== "Tab") return;

    const f = getFocusable(_trapContainer);
    if (f.length === 0) {
      e.preventDefault();
      return;
    }

    const first = f[0];
    const last = f[f.length - 1];

    if (!e.shiftKey && document.activeElement === last) {
      // Tab on last goes to first
      e.preventDefault();
      first.focus();
    } else if (e.shiftKey && document.activeElement === first) {
      // Shift+Tab on first goes to last
      e.preventDefault();
      last.focus();
    }
  };

  document.addEventListener("keydown", _trapHandler);
}

function releaseFocusTrap() {
  if (_trapHandler) {
    document.removeEventListener("keydown", _trapHandler);
    _trapHandler = null;
  }
  if (_previouslyFocused && typeof _previouslyFocused.focus === "function") {
    _previouslyFocused.focus();
  }
  _previouslyFocused = null;
  _trapContainer = null;
}

/* ================================
   Expose minimal API (helpful for debugging)
================================ */
window.__siteControls = {
  openMenu: () => {
    const sideMenu = document.getElementById("sideMenu");
    const overlay = document.getElementById("overlay");
    const hamburger = document.getElementById("hamburger");
    if (!sideMenu || !overlay || !hamburger) return;
    sideMenu.classList.add("open");
    overlay.classList.add("show");
    hamburger.classList.add("active");
    hamburger.setAttribute("aria-expanded", "true");
    openFocusTrap(sideMenu);
  },
  closeMenu: closeMenu,
  toggleMenu: toggleMenu
};