// modo-oscuro.js
// Librería para aplicar modo oscuro en cualquier página
// Uso: toggleDarkMode.init(); para activar el botón automáticamente

const toggleDarkMode = (() => {
  // Crea un botón flotante si no existe
  function crearBoton() {
    let btn = document.createElement("button");
    btn.innerText = "🌙";
    btn.id = "toggleDarkBtn";
    Object.assign(btn.style, {
      position: "fixed",
      bottom: "20px",
      right: "20px",
      padding: "10px 15px",
      fontSize: "20px",
      cursor: "pointer",
      borderRadius: "8px",
      border: "none",
      zIndex: 1000
    });
    btn.onclick = toggle;
    document.body.appendChild(btn);
  }

  // Alterna la clase dark en body
  function toggle() {
    document.body.classList.toggle("dark");
    localStorage.setItem("darkMode", document.body.classList.contains("dark"));
  }

  // Inicializa según preferencia guardada
  function init() {
    if (localStorage.getItem("darkMode") === "true") {
      document.body.classList.add("dark");
    }
    crearBoton();
  }

  return { init, toggle };
})();
