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

  // Newsletter share links
  const shareButtons = document.querySelectorAll("[data-share]");
  if (shareButtons.length) {
    const pageUrl = window.location.href;
    const pageTitle = document.title;

    const copyText = text => {
      if (navigator.clipboard && window.isSecureContext) {
        return navigator.clipboard.writeText(text).then(() => true).catch(() => false);
      }

      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();

      let success = false;
      try {
        success = document.execCommand("copy");
      } catch (error) {
        success = false;
      }
      document.body.removeChild(textarea);
      return Promise.resolve(success);
    };

    shareButtons.forEach(button => {
      const type = button.getAttribute("data-share");
      if (type === "facebook") {
        button.href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`;
      } else if (type === "x") {
        button.href = `https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(pageTitle)}`;
      } else if (type === "email") {
        button.href = `mailto:?subject=${encodeURIComponent(pageTitle)}&body=${encodeURIComponent(pageUrl)}`;
      } else if (type === "copy") {
        const label = button.querySelector("span") || button;
        const defaultLabel = label.textContent;
        button.addEventListener("click", () => {
          copyText(pageUrl).then(success => {
            label.textContent = success ? "Copied" : "Copy failed";
            setTimeout(() => {
              label.textContent = defaultLabel;
            }, 2000);
          });
        });
      } else if (type === "print") {
        button.addEventListener("click", () => {
          window.print();
        });
      }
    });
  }
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
