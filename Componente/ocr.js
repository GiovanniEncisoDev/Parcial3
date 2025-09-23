// ocr.js
// Componente OCR Beta - modular y reutilizable
// Uso: OCRComponent.init({ inputId, outputId, previewId })

const OCRComponent = (() => {

  function init({ inputId, outputId, previewId }) {
    const input = document.getElementById(inputId);
    const output = document.getElementById(outputId);
    const preview = document.getElementById(previewId);

    if(!input || !output || !preview) {
      console.error("Elementos no encontrados");
      return;
    }

    input.addEventListener("change", e => {
      const file = e.target.files[0];
      if(!file) return;

      const reader = new FileReader();
      reader.onload = function(ev) {
        // Mostrar imagen temporal
        const img = new Image();
        img.src = ev.target.result;
        img.style.maxWidth = "400px";
        img.style.display = "block";
        img.id = "ocrPreviewImg";

        preview.innerHTML = "";
        preview.appendChild(img);

        // Procesar OCR
        output.innerHTML = "Procesando...";
        Tesseract.recognize(img.src, 'spa', {
          logger: m => {
            if(m.status === "recognizing text") {
              output.innerHTML = `Procesando: ${(m.progress*100).toFixed(2)}%`;
            }
          }
        })
        .then(({ data: { text, words } }) => {
          output.innerHTML = ""; // Limpiar
          words.forEach(word => {
            const span = document.createElement("span");
            span.textContent = word.text + " ";
            span.style.cursor = "pointer";
            span.title = "Click para editar";
            
            // Al pasar el cursor, se resalta la zona de la imagen
            span.addEventListener("mouseenter", () => highlightWord(img, word));
            span.addEventListener("mouseleave", () => removeHighlight(img));
            
            // Editar texto manualmente
            span.addEventListener("click", () => {
              const nuevo = prompt("Editar palabra:", span.textContent.trim());
              if(nuevo !== null) span.textContent = nuevo + " ";
            });

            output.appendChild(span);
          });
        })
        .catch(err => {
          output.innerHTML = "Error procesando OCR";
          console.error(err);
        });
      };
      reader.readAsDataURL(file);
    });
  }

  // Función para resaltar palabra en imagen (simulación)
  function highlightWord(img, word) {
    img.style.outline = "2px solid red";
  }

  function removeHighlight(img) {
    img.style.outline = "";
  }

  return { init };
})();
