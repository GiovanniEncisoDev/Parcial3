const pdfFileInput = document.getElementById("pdfFile");
const pdfViewer = document.getElementById("pdfViewer");
const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");
let currentTool = 'edit';
let currentColor = '#ff0000';
let pdfData = null;

document.getElementById("tool").addEventListener("change", e => currentTool = e.target.value);
document.getElementById("colorPicker").addEventListener("change", e => currentColor = e.target.value);

pdfFileInput.addEventListener("change", async e => {
  if (!e.target.files[0]) return;
  pdfData = await e.target.files[0].arrayBuffer();
  processPDF(pdfData);
});

async function processPDF(arrayBuffer) {
  pdfViewer.innerHTML = "";
  const pdfjsLib = window['pdfjs-dist/build/pdf'];
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale: 1.5 });

    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext("2d");
    await page.render({ canvasContext: ctx, viewport }).promise;

    const img = document.createElement("img");
    img.src = canvas.toDataURL();
    img.className = "pageImage";

    const pageContainer = document.createElement("div");
    pageContainer.className = "pageContainer";
    pageContainer.style.width = viewport.width + "px";
    pageContainer.style.height = viewport.height + "px";
    pageContainer.appendChild(img);
    pdfViewer.appendChild(pageContainer);

    // OCR Automático
    progressText.textContent = `Procesando página ${pageNum}/${pdf.numPages}...`;
    const { data: { words } } = await Tesseract.recognize(img.src, 'spa', {
      logger: m => {
        if (m.status === 'recognizing text') {
          progressBar.value = (m.progress + pageNum - 1) / pdf.numPages * 100;
        }
      }
    });

    words.forEach(word => {
      const input = document.createElement("input");
      input.value = word.text;
      input.className = "textOverlay";
      const left = word.bbox.x0 * (viewport.width / word.bbox.width);
      const top = word.bbox.y0 * (viewport.height / word.bbox.height);
      input.style.left = `${word.bbox.x0 * 1.5}px`;
      input.style.top = `${word.bbox.y0 * 1.5}px`;
      input.style.width = `${(word.bbox.x1 - word.bbox.x0) * 1.5}px`;
      input.style.height = `${(word.bbox.y1 - word.bbox.y0) * 1.5}px`;
      input.style.color = currentColor;

      input.addEventListener("click", () => {
        if (currentTool === 'draw') {
          input.style.backgroundColor = currentColor;
        } else {
          input.removeAttribute("readonly");
        }
      });

      pageContainer.appendChild(input);
    });
  }
  progressText.textContent = "OCR completado!";
  progressBar.value = 100;
}

// Guardar PDF con cambios (solo texto superpuesto)
document.getElementById("savePdf").addEventListener("click", async () => {
  if (!pdfData) return alert("Carga un PDF primero.");
  const pdfDoc = await PDFLib.PDFDocument.load(pdfData);
  const pages = pdfDoc.getPages();

  pdfViewer.querySelectorAll(".pageContainer").forEach((container, index) => {
    const page = pages[index];
    const { width, height } = page.getSize();
    const inputs = container.querySelectorAll(".textOverlay");
    inputs.forEach(input => {
      const x = parseFloat(input.style.left);
      const y = height - parseFloat(input.style.top) - parseFloat(input.style.height);
      page.drawText(input.value, {
        x, y,
        size: 16,
        color: PDFLib.rgb(1, 0, 0) // color rojo por defecto
      });
    });
  });

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "PDF_editado.pdf";
  link.click();
});
