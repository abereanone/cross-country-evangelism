document.addEventListener('DOMContentLoaded', () => {
  // Toggle blog comments
  const buttons = document.querySelectorAll('.show-comments-btn');
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const comments = button.nextElementSibling;
      if (comments.classList.contains('hidden')) {
        comments.classList.remove('hidden');
        button.textContent = 'Hide Comments';
      } else {
        comments.classList.add('hidden');
        button.textContent = 'Show Comments';
      }
    });
  });

  // Hamburger menu toggle
  const menuToggle = document.getElementById("menu-toggle");
  const nav = document.querySelector("header nav");

  menuToggle.addEventListener("click", () => {
    nav.classList.toggle("active");

    // Toggle aria-expanded for accessibility
    const expanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", !expanded);
  });

  // Close menu when clicking a nav link (mobile)
  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      if (nav.classList.contains("active")) {
        nav.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", false);
      }
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector("header");
  const headerHeight = header.offsetHeight;

  function offsetAnchor() {
    if (window.location.hash) {
      window.scrollBy(0, -headerHeight);
    }
  }

  // Offset on page load if hash present
  offsetAnchor();

  // Offset on hash change (clicking nav links)
  window.addEventListener("hashchange", offsetAnchor);
});
