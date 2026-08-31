document.querySelectorAll("[data-filter]").forEach((button) => button.addEventListener("click", () => {
  document.querySelectorAll("[data-filter]").forEach((item) => item.classList.toggle("active", item === button));
  document.querySelectorAll(".products article").forEach((product) => {
    product.hidden = button.dataset.filter !== "all" && product.dataset.cat !== button.dataset.filter;
  });
}));
document.querySelector("#fast-quote").addEventListener("submit", (event) => {
  event.preventDefault(); document.querySelector("#fast-message").textContent = "Demo complete — no quote was sent or stored."; event.currentTarget.reset();
});
document.querySelector("#dealer-form").addEventListener("submit", (event) => {
  event.preventDefault(); document.querySelector("#dealer-message").textContent = "Demo complete — no application was sent or stored."; event.currentTarget.reset();
});
