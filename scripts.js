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
});
