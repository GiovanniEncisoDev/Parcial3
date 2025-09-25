const OCRComponent = (() => {

  let worker = null;

  async function init({ inputId, previewId, outputId }) {
    const input = document.getElementById(inputId);
    const preview = document.getElementById(previewId);
    const output = document.getElementById(outputId);

    if (!input || !preview || !output) {
      console.error("Elementos no encontrados");
      return;
    }

    if (!worker) {
      worker = Tesseract.createWorker({
        logger: m => {
          if (m.status === "recognizing text") output.innerHTML = `Procesando: ${(m.progress*100).toFixed(2)}%`;
        },
        cachePath: "tessdata"
      });
      await worker.load();
      await worker.loadLanguage("spa");
      await worker.initialize("spa");
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

          const viewport = page.getViewport({ scale: 1.5 });
          const canvasVis = document.createElement("canvas");
          canvasVis.width = viewport.width;
          canvasVis.height = viewport.height;
          const ctxVis = canvasVis.getContext("2d");
          await page.render({ canvasContext: ctxVis, viewport }).promise;
          preview.appendChild(canvasVis);

          // Canvas reducido para OCR
          const scaleOCR = 0.5;
          const canvasOCR = document.createElement("canvas");
          canvasOCR.width = viewport.width * scaleOCR;
          canvasOCR.height = viewport.height * scaleOCR;
          const ctxOCR = canvasOCR.getContext("2d");
          ctxOCR.drawImage(canvasVis, 0, 0, canvasOCR.width, canvasOCR.height);

          runOCRWithLayout(canvasOCR.toDataURL(), output, canvasVis, scaleOCR);
        };
        reader.readAsArrayBuffer(file);
      } else {
        const reader = new FileReader();
        reader.onload = function(ev) {
          const img = new Image();
          img.onload = function() {
            preview.innerHTML = "";
            preview.appendChild(img);

            const maxWidth = 1000;
            let canvasOCR = document.createElement("canvas");
            const scale = Math.min(1, maxWidth / img.width);
            canvasOCR.width = img.width * scale;
            canvasOCR.height = img.height * scale;
            const ctx = canvasOCR.getContext("2d");
            ctx.drawImage(img, 0, 0, canvasOCR.width, canvasOCR.height);

            runOCRWithLayout(canvasOCR.toDataURL(), output, img, scale);
          };
          img.src = ev.target.result;
          img.style.maxWidth = "100%";
          img.style.display = "block";
        };
        reader.readAsDataURL(file);
      }
    });
  }

  async function runOCRWithLayout(src, output, img, scaleFactor) {
    output.innerHTML = "";
    const { data: { words } } = await worker.recognize(src);

    // Agrupar palabras por línea usando y0
    words.sort((a,b) => a.bbox.y0 - b.bbox.y0);
    let lines = [];
    let currentLine = [];
    let lastY = -1;
    const threshold = 10; // px

    words.forEach(word => {
      const y = word.bbox.y0 / scaleFactor;
      if (lastY === -1 || Math.abs(y - lastY) < threshold) {
        currentLine.push(word);
      } else {
        lines.push(currentLine);
        currentLine = [word];
      }
      lastY = y;
    });
    if(currentLine.length > 0) lines.push(currentLine);

    // Crear DOM por línea
    lines.forEach(line => {
      const divLine = document.createElement("div");
      line.forEach(word => {
        const span = document.createElement("span");
        span.textContent = word.text + " ";

        // Posición horizontal
        const marginLeft = (word.bbox.x0 / scaleFactor);
        span.style.marginLeft = marginLeft + "px";

        // Hover para resaltar
        span.addEventListener("mouseenter", () => highlightWord(img, word, scaleFactor));
        span.addEventListener("mouseleave", () => removeHighlight(img));

        // Click para editar
        span.addEventListener("click", () => {
          const nuevo = prompt("Editar palabra:", span.textContent.trim());
          if (nuevo !== null) span.textContent = nuevo + " ";
        });

        divLine.appendChild(span);
      });
      output.appendChild(divLine);
    });
  }

  function highlightWord(img, word, scaleFactor) {
    const x = word.bbox.x0 / scaleFactor;
    const y = word.bbox.y0 / scaleFactor;
    const w = (word.bbox.x1 - word.bbox.x0) / scaleFactor;
    const h = (word.bbox.y1 - word.bbox.y0) / scaleFactor;

    // Crear overlay temporal
    if(!img._highlight) {
      const div = document.createElement("div");
      div.style.position = "absolute";
      div.style.border = "2px solid red";
      div.style.pointerEvents = "none";
      img.parentElement.style.position = "relative";
      img.parentElement.appendChild(div);
      img._highlight = div;
    }
    const div = img._highlight;
    div.style.left = x + "px";
    div.style.top = y + "px";
    div.style.width = w + "px";
    div.style.height = h + "px";
    div.style.display = "block";
  }

  function removeHighlight(img) {
    if(img._highlight) img._highlight.style.display = "none";
  }

  return { init };
})();
