window.BRIOFRAME_GEN2 = {
  initSimulatedForms(root = document) {
    root.querySelectorAll("[data-demo-form]").forEach((form) => {
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        const output = form.querySelector("[data-form-status]");
        if (output) {
          output.textContent = "Demo complete — no information was sent or stored.";
        }
      });
    });
  }
};
