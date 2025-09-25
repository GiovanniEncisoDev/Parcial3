const OCRComponent = (() => {

let worker = null;

async function init({ inputId, previewId, outputId }) {
  const input = document.getElementById(inputId);
  const preview = document.getElementById(previewId);
  const output = document.getElementById(outputId);

  if(!input || !preview || !output) return console.error("Elementos no encontrados");

  // Crear worker Tesseract
  if(!worker){
    worker = Tesseract.createWorker({
      logger: m => {
        if(m.status === "recognizing text") output.innerHTML = `Procesando: ${(m.progress*100).toFixed(2)}%`;
        else output.innerHTML = m.status;
      },
      cachePath: "tessdata"
    });
    await worker.load();
    await worker.loadLanguage("spa");
    await worker.initialize("spa");
  }

  input.addEventListener("change", async e => {
    const file = e.target.files[0];
    if(!file) return;

    preview.innerHTML = "";
    output.innerHTML = "Preparando archivo...";

    if(file.type === "application/pdf"){
      const reader = new FileReader();
      reader.onload = async function(ev){
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

        runOCRFields(canvasOCR.toDataURL(), output, canvasVis, scaleOCR);
      };
      reader.readAsArrayBuffer(file);

    } else {
      const reader = new FileReader();
      reader.onload = function(ev){
        const img = new Image();
        img.onload = function(){
          preview.innerHTML = "";
          preview.appendChild(img);

          const maxWidth = 1000;
          const scale = Math.min(1, maxWidth/img.width);
          const canvasOCR = document.createElement("canvas");
          canvasOCR.width = img.width * scale;
          canvasOCR.height = img.height * scale;
          const ctx = canvasOCR.getContext("2d");
          ctx.drawImage(img,0,0,canvasOCR.width,canvasOCR.height);

          runOCRFields(canvasOCR.toDataURL(), output, img, scale);
        };
        img.src = ev.target.result;
        img.style.maxWidth = "100%";
      };
      reader.readAsDataURL(file);
    }
  });
}

// Función para extraer campos específicos
async function runOCRFields(src, output, img, scaleFactor){
  const { data: { words } } = await worker.recognize(src);

  const fullText = words.map(w=>w.text).join(" ");

  // CURP
  const curpMatch = fullText.match(/[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z0-9]\d/);
  const curp = curpMatch ? curpMatch[0] : "No encontrado";

  // Código de barras (número de 12+ dígitos)
  const barcodeMatch = fullText.match(/\d{12,}/);
  const barcode = barcodeMatch ? barcodeMatch[0] : "No encontrado";

  // Nombre aproximado: palabras antes de CURP
  let nombre = "No encontrado";
  let estado = "No encontrado";
  if(curpMatch){
    const curpIndex = words.findIndex(w=>w.text.includes(curpMatch[0].slice(0,4)));
    nombre = words.slice(0,curpIndex).map(w=>w.text).join(" ");
    estado = words.slice(curpIndex+1,curpIndex+5).map(w=>w.text).join(" ");
  }

  // Mostrar resultados
  output.innerHTML = "";
  output.appendChild(createEditableField("CURP", curp));
  output.appendChild(createEditableField("Nombre", nombre));
  output.appendChild(createEditableField("Estado", estado));
  output.appendChild(createEditableField("Código de barras", barcode));

  // Extraer imagen del código de barras (zona inferior del OCR)
  const lastWord = words[words.length-1];
  const x0 = lastWord.bbox.x0 / scaleFactor;
  const y0 = lastWord.bbox.y0 / scaleFactor;
  const x1 = lastWord.bbox.x1 / scaleFactor;
  const y1 = lastWord.bbox.y1 / scaleFactor;

  const canvasBarcode = document.createElement("canvas");
  canvasBarcode.width = x1 - x0;
  canvasBarcode.height = y1 - y0;
  const ctx = canvasBarcode.getContext("2d");
  ctx.drawImage(img, x0, y0, x1-x0, y1-y0, 0,0, x1-x0, y1-y0);

  const imgEl = document.createElement("img");
  imgEl.id = "barcodeImg";
  imgEl.src = canvasBarcode.toDataURL();
  output.appendChild(imgEl);
}

// Crear campo editable
function createEditableField(label, value){
  const p = document.createElement("p");
  const span = document.createElement("span");
  span.textContent = value;
  span.addEventListener("click", ()=> {
    const nuevo = prompt(`Editar ${label}:`, span.textContent);
    if(nuevo!==null) span.textContent = nuevo;
  });
  p.innerHTML = `<b>${label}:</b> `;
  p.appendChild(span);
  return p;
}

return { init };
})();
