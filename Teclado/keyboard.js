// keyboard.js
export function createVirtualKeyboard(inputId) {
  const inputField = document.getElementById(inputId);
  if (!inputField) {
    console.error(`No se encontró un input con id="${inputId}"`);
    return;
  }

  // ======================
  // Crear contenedor del teclado
  // ======================
  let keyboard = document.createElement('div');
  keyboard.classList.add('virtual-keyboard');
  inputField.parentNode.insertBefore(keyboard, inputField.nextSibling);

  // ======================
  // Inyectar estilos dinámicamente
  // ======================
  if (!document.getElementById('virtual-keyboard-styles')) {
    const style = document.createElement('style');
    style.id = 'virtual-keyboard-styles';
    style.textContent = `
      .virtual-keyboard {
        display: grid;
        grid-template-columns: repeat(10, 1fr);
        gap: 5px;
        margin-top: 10px;
        max-width: 500px;
      }
      .vk-key {
        padding: 12px;
        font-size: 16px;
        background: #fff;
        border: 1px solid #ccc;
        border-radius: 5px;
        cursor: pointer;
        text-align: center;
        user-select: none;
        transition: background 0.2s;
      }
      .vk-key:active {
        background: #ddd;
      }
      .vk-key.wide {
        grid-column: span 2;
      }
    `;
    document.head.appendChild(style);
  }

  // ======================
  // Teclas del teclado
  // ======================
  const keys = [
    "1","2","3","4","5","6","7","8","9","0",
    "q","w","e","r","t","y","u","i","o","p",
    "a","s","d","f","g","h","j","k","l",
    "z","x","c","v","b","n","m",
    "Espacio","Borrar"
  ];

  // Limpiar contenedor
  keyboard.innerHTML = '';

  keys.forEach(key => {
    const button = document.createElement('div');
    button.classList.add('vk-key');
    button.textContent = key;
    if (key === "Espacio" || key === "Borrar") button.classList.add('wide');

    button.addEventListener('click', () => {
      if (key === "Borrar") {
        inputField.value = inputField.value.slice(0, -1);
      } else if (key === "Espacio") {
        inputField.value += " ";
      } else {
        inputField.value += key;
      }
      inputField.focus();
    });

    keyboard.appendChild(button);
  });
}
