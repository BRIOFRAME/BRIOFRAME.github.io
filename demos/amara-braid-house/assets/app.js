document.querySelectorAll("[data-service]").forEach((button) => button.addEventListener("click", () => {
  document.querySelector("#service").value = button.dataset.service;
  document.querySelector("#book").scrollIntoView({behavior: "smooth"});
}));
document.querySelector("[data-demo-form]").addEventListener("submit", (event) => {
  event.preventDefault();
  document.querySelector("#form-message").textContent = "Demo complete — no information was sent or stored.";
  event.currentTarget.reset();
});
