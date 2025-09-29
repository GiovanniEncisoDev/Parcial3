// Componente de calificación flexible con imágenes locales
const RatingComponent = (() => {

  function init({
    containerId,
    max = 5,
    icon = null,
    iconSize = 40,
    allowHalf = false,
    showValue = true,
    mode = "fill", // "fill" -> relleno de color, "color" -> muestra color original
    fillColor = "gold",
    onChange = null
  }) {
    const container = document.getElementById(containerId);
    if (!container) return console.error("Contenedor no encontrado");
    container.innerHTML = "";

    const ratingState = { value: 0 };
    const wrapper = document.createElement("div");
    wrapper.className = "rating-wrapper";

    const icons = [];

    for (let i = 1; i <= max; i++) {
      const iconEl = document.createElement("span");
      iconEl.className = "icon";
      iconEl.style.width = iconSize + "px";
      iconEl.style.height = iconSize + "px";

      if (icon) {
        iconEl.style.backgroundImage = `url(${icon})`;
      } else {
        iconEl.textContent = "☆";
        iconEl.style.fontSize = iconSize + "px";
        iconEl.style.color = "#ccc";
        iconEl.style.filter = "grayscale(0%)";
      }

      iconEl.dataset.value = i;

      // Hover
      iconEl.addEventListener("mousemove", (e) => {
        let val = i;
        if (allowHalf) {
          const rect = e.target.getBoundingClientRect();
          const x = e.clientX - rect.left;
          val = x < rect.width / 2 ? i - 0.5 : i;
        }
        highlight(wrapper, val, icon, mode, fillColor);
      });

      iconEl.addEventListener("mouseleave", () => {
        highlight(wrapper, ratingState.value, icon, mode, fillColor);
      });

      iconEl.addEventListener("click", (e) => {
        let val = i;
        if (allowHalf) {
          const rect = e.target.getBoundingClientRect();
          const x = e.clientX - rect.left;
          val = x < rect.width / 2 ? i - 0.5 : i;
        }
        ratingState.value = val;
        highlight(wrapper, val, icon, mode, fillColor);
        if (showValue) valueEl.textContent = val;
        if (onChange) onChange(val);
      });

      icons.push(iconEl);
      wrapper.appendChild(iconEl);
    }

    let valueEl;
    if (showValue) {
      valueEl = document.createElement("span");
      valueEl.style.marginLeft = "10px";
      valueEl.textContent = ratingState.value;
      wrapper.appendChild(valueEl);
    }

    container.appendChild(wrapper);
    highlight(wrapper, 0, icon, mode, fillColor);

    function highlight(wrapper, value, icon, mode, fillColor) {
      const children = Array.from(wrapper.children).filter(c => c.tagName === "SPAN");
      children.forEach((el, idx) => {
        el.classList.remove("filled");
        if (icon) {
          if (mode === "fill") {
            el.style.filter = idx + 1 <= value ? "grayscale(0%)" : "grayscale(100%)";
            if (idx + 0.5 === value) el.style.filter = "grayscale(50%)";
            if (idx + 1 <= value) {
              el.style.setProperty("--fill-color", fillColor);
              el.classList.add("filled");
            }
          } else if (mode === "color") {
            el.style.filter = idx + 1 <= value ? "grayscale(0%)" : "grayscale(100%)";
            if (idx + 0.5 === value) el.style.filter = "grayscale(50%)";
          }
        } else {
          if (idx + 1 <= value) el.textContent = "★";
          else if (idx + 0.5 === value) el.textContent = "☆";
          else el.textContent = "☆";
        }
      });
    }
  }

  return { init };
})();
