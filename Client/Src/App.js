const openButton = document.getElementById("open-modal");
const closeButton = document.getElementById("close-modal");
const modal = document.getElementById("audit-modal");

openButton.addEventListener("click", () => {
  modal.showModal();
});

closeButton.addEventListener("click", () => {
  modal.close();
});
