document.querySelector("[data-demo-form]").addEventListener("submit", (event) => {
  event.preventDefault();
  document.querySelector("#form-message").textContent = "Demo complete — no information was sent or stored.";
  event.currentTarget.reset();
});
