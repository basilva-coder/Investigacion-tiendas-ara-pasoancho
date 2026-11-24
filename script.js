// Animaciones progresivas: el contenido permanece visible si JS no está disponible.
document.documentElement.classList.add("js-ready");

const revealItems = document.querySelectorAll(".reveal");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if ("IntersectionObserver" in window && !reduceMotion) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Abrir menú" : "Cerrar menú");
    navLinks.classList.toggle("is-open", !isOpen);
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Abrir menú");
      navLinks.classList.remove("is-open");
    });
  });
}

const galleryButtons = document.querySelectorAll(".gallery-photo-button");
const photoLightbox = document.querySelector("#photo-lightbox");
const lightboxImage = photoLightbox?.querySelector(".lightbox-image");
const lightboxCaption = photoLightbox?.querySelector(".lightbox-caption");
const lightboxClose = photoLightbox?.querySelector(".lightbox-close");

galleryButtons.forEach((button) => {
  const image = button.querySelector(".gallery-image");
  const fallback = button.querySelector(".image-fallback");

  if (image && fallback) {
    fallback.hidden = false;

    const showFallback = () => {
      button.classList.remove("is-loaded");
      button.classList.add("is-unavailable");
      button.disabled = true;
    };

    const showImage = () => {
      button.classList.add("is-loaded");
      button.classList.remove("is-unavailable");
      button.disabled = false;
      fallback.hidden = true;
    };

    image.addEventListener("error", () => {
      showFallback();
    });
    image.addEventListener("load", showImage);

    if (image.complete) {
      if (image.naturalWidth > 0) {
        showImage();
      } else {
        showFallback();
      }
    }
  }
});

if (photoLightbox && lightboxImage && lightboxCaption && lightboxClose && "showModal" in photoLightbox) {
  galleryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const figure = button.closest(".gallery-card");
      const image = button.querySelector(".gallery-image");
      const caption = figure?.querySelector("figcaption");

      if (!image || !caption) {
        return;
      }

      lightboxImage.src = image.currentSrc || image.src;
      lightboxImage.alt = image.alt;
      lightboxCaption.textContent = caption.innerText;
      photoLightbox.showModal();
      lightboxClose.focus();
    });
  });

  lightboxClose.addEventListener("click", () => photoLightbox.close());
  photoLightbox.addEventListener("click", (event) => {
    if (event.target === photoLightbox) {
      photoLightbox.close();
    }
  });
}

const feedbackForm = document.querySelector("#feedback-form");
const brandPreferenceGroup = document.querySelector("#brand-preference-group");
const formFeedback = document.querySelector("#form-feedback");

if (feedbackForm && brandPreferenceGroup && formFeedback) {
  feedbackForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const preference = feedbackForm.querySelector('input[name="brand-preference"]:checked');
    formFeedback.hidden = false;

    if (!preference) {
      brandPreferenceGroup.setAttribute("aria-invalid", "true");
      formFeedback.dataset.state = "error";
      formFeedback.textContent = "Selecciona una preferencia de marca antes de enviar tu opinión.";
      formFeedback.focus();
      return;
    }

    brandPreferenceGroup.removeAttribute("aria-invalid");
    feedbackForm.reset();
    formFeedback.dataset.state = "success";
    formFeedback.textContent = "¡Gracias por aportar a nuestra investigación de mercados!";
    formFeedback.focus();
  });

  feedbackForm.querySelectorAll('input[name="brand-preference"]').forEach((input) => {
    input.addEventListener("change", () => {
      brandPreferenceGroup.removeAttribute("aria-invalid");
      if (formFeedback.dataset.state === "error") {
        formFeedback.hidden = true;
        formFeedback.textContent = "";
      }
    });
  });
}
