const focusableElements = document.querySelectorAll(
  'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
);

focusableElements.forEach((element) => {
  element.addEventListener("focus", () => {
    element.classList.add("keyboard-focus");
  });

  element.addEventListener("blur", () => {
    element.classList.remove("keyboard-focus");
  });
});
