const OCRComponent = (() => {

  let worker = null;
  let modeloCargado = false;

  async function init({ inputId, previewId, outputId }) {
    const input = document.getElementById(inputId);
    const preview = document.getElementById(previewId);
    const output = document.getElementById(outputId);

    if (!input || !preview || !output) {
      console.error("Elementos no encontrados");
      return;
    }

    // Crear worker Tesseract
    if (!worker) {
      worker = Tesseract.createWorker({
        logger: m => {
          if (m.status === "loading tesseract core") output.innerHTML = "Cargando OCR...";
          else if (m.status === "loading language traineddata") output.innerHTML = "Descargando modelo español...";
          else if (m.status === "initializing api") output.innerHTML = "Inicializando OCR...";
          else if (m.status === "recognizing text") output.innerHTML = `Procesando: ${(m.progress*100).toFixed(2)}%`;
        },
        cachePath: "tessdata"
      });
      await worker.load();
      await worker.loadLanguage("spa");
      await worker.initialize("spa");
      modeloCargado = true;
    }

    input.addEventListener("change", async e => {
      const file = e.target.files[0];
      if (!file) return;

      preview.innerHTML = "";
      output.innerHTML = "Preparando archivo...";

      if (file.type === "application/pdf") {
        const reader = new FileReader();
        reader.onload = async function(ev) {
          const typedarray = new Uint8Array(ev.target.result);
          const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
          const page = await pdf.getPage(1);

          const viewport = page.getViewport({ scale: 2 });
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          canvas.width = viewport.width;
          canvas.height = viewport.height;

          await page.render({ canvasContext: ctx, viewport }).promise;
          preview.appendChild(canvas);

          runOCR(canvas.toDataURL(), output, canvas);
        };
        reader.readAsArrayBuffer(file);
      } else {
        const reader = new FileReader();
        reader.onload = function(ev) {
          const img = new Image();
          img.src = ev.target.result;
          img.style.maxWidth = "100%";
          img.style.display = "block";

          preview.appendChild(img);
          runOCR(img.src, output, img);
        };
        reader.readAsDataURL(file);
      }
    });
  }

  async function runOCR(src, output, img) {
    output.innerHTML = "";

    const { data: { words } } = await worker.recognize(src);

    words.forEach(word => {
      const span = document.createElement("span");
      span.textContent = word.text + " ";

      span.addEventListener("mouseenter", () => highlightWord(img, word));
      span.addEventListener("mouseleave", () => removeHighlight(img));

      span.addEventListener("click", () => {
        const nuevo = prompt("Editar palabra:", span.textContent.trim());
        if (nuevo !== null) span.textContent = nuevo + " ";
      });

      output.appendChild(span);
    });
  }

  function highlightWord(img, word) {
    img.style.outline = "2px solid red";
  }

  function removeHighlight(img) {
    img.style.outline = "";
  }

  return { init };
})();
