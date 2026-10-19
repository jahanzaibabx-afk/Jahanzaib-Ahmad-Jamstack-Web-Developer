document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".nav-links");

  if (menuButton && navigation) {
    const closeMenu = () => {
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Open navigation menu");
      navigation.classList.remove("is-open");
    };

    menuButton.addEventListener("click", () => {
      const isOpen = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!isOpen));
      menuButton.setAttribute("aria-label", isOpen ? "Open navigation menu" : "Close navigation menu");
      navigation.classList.toggle("is-open", !isOpen);
    });

    navigation.addEventListener("click", (event) => {
      if (event.target instanceof Element && event.target.closest("a")) closeMenu();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
        closeMenu();
        menuButton.focus();
      }
    });
  }

  document.querySelectorAll("[data-year]").forEach((element) => {
    element.textContent = String(new Date().getFullYear());
  });

  const form = document.querySelector("#contact-form");
  if (form instanceof HTMLFormElement) {
    const status = document.querySelector("#form-status");
    const fields = ["name", "email", "subject", "message"];

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      let isValid = true;

      fields.forEach((fieldName) => {
        const input = form.elements.namedItem(fieldName);
        const error = document.querySelector(`#${fieldName}-error`);
        if (!(input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement) || !(error instanceof HTMLElement)) return;

        input.setCustomValidity("");
        const value = input.value.trim();
        if (!value) input.setCustomValidity("Please complete this field.");
        else if (fieldName === "name" && value.length < 2) input.setCustomValidity("Please enter at least 2 characters.");
        else if (fieldName === "subject" && value.length < 3) input.setCustomValidity("Please enter at least 3 characters.");
        else if (fieldName === "message" && value.length < 10) input.setCustomValidity("Please enter at least 10 characters.");
        else if (fieldName === "email" && !input.validity.valid) input.setCustomValidity("Please enter a valid email address.");

        error.textContent = input.validationMessage;
        input.setAttribute("aria-invalid", String(!input.validity.valid));
        if (!input.validity.valid) isValid = false;
      });

      if (!isValid) {
        if (status) status.textContent = "Please check the highlighted fields and try again.";
        const firstInvalid = form.querySelector('[aria-invalid="true"]');
        if (firstInvalid instanceof HTMLElement) firstInvalid.focus();
        return;
      }

      const formData = new FormData(form);
      const name = String(formData.get("name")).trim();
      const senderEmail = String(formData.get("email")).trim();
      const subject = String(formData.get("subject")).trim();
      const message = String(formData.get("message")).trim();
      const body = `From: ${name}\nEmail: ${senderEmail}\n\n${message}`;
      const mailto = `mailto:jahanzaibabx@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      if (status) status.textContent = "Your email draft is ready. Review it in your email app and send it there.";
      window.location.href = mailto;
    });

    fields.forEach((fieldName) => {
      const input = form.elements.namedItem(fieldName);
      const error = document.querySelector(`#${fieldName}-error`);
      if (!(input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement) || !(error instanceof HTMLElement)) return;
      input.addEventListener("input", () => {
        input.setCustomValidity("");
        error.textContent = "";
        input.setAttribute("aria-invalid", "false");
      });
    });
  }
});
