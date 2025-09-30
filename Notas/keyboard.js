export function createVirtualKeyboard(inputId) {
  const input = document.getElementById(inputId);
  if (!input) return;

  // Crear overlay del teclado
  const keyboardContainer = document.createElement('div');
  keyboardContainer.className = 'virtual-keyboard-overlay';
  keyboardContainer.innerHTML = `
    <div class="virtual-keyboard">
      <div class="vk-keys"></div>
    </div>
  `;
  document.body.appendChild(keyboardContainer);

  const keys = [
    ..."1234567890",
    ..."qwertyuiop",
    ..."asdfghjklñ",
    ..."zxcvbnm",
    "space","backspace","enter"
  ];

  const keysContainer = keyboardContainer.querySelector('.vk-keys');

  keys.forEach(key => {
    const btn = document.createElement('button');
    btn.className = 'vk-btn';
    btn.textContent = key === "space" ? "␣" : 
                      key === "backspace" ? "⌫" : 
                      key === "enter" ? "⏎" : key;
    btn.addEventListener('click', () => {
      if (key === "backspace") {
        input.value = input.value.slice(0, -1);
      } else if (key === "enter") {
        input.form?.dispatchEvent(new Event("submit", {cancelable: true, bubbles: true}));
      } else if (key === "space") {
        input.value += " ";
      } else {
        input.value += key;
      }
      input.focus();
    });
    keysContainer.appendChild(btn);
  });

  // Mostrar/ocultar el teclado según el foco
  input.addEventListener('focus', () => {
    keyboardContainer.style.display = 'flex';
  });
  input.addEventListener('blur', () => {
    setTimeout(() => {
      keyboardContainer.style.display = 'none';
    }, 200); // pequeño delay para no cortar clics
  });

  // Estilos básicos
  const style = document.createElement('style');
  style.textContent = `
    .virtual-keyboard-overlay {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      display: none;
      justify-content: center;
      align-items: flex-end;
      background: rgba(0,0,0,0.4);
      padding: 10px;
      z-index: 9999;
    }
    .virtual-keyboard {
      background: #fff;
      border-radius: 12px;
      padding: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      max-width: 600px;
    }
    .vk-btn {
      padding: 10px 14px;
      border: none;
      border-radius: 6px;
      background: #e0e0e0;
      cursor: pointer;
      font-size: 16px;
      flex: 1 0 auto;
      transition: background 0.2s;
    }
    .vk-btn:hover {
      background: #ccc;
    }
    .vk-btn:active {
      background: #aaa;
    }
  `;
  document.head.appendChild(style);
}
