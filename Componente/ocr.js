import Tesseract from "https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.esm.min.js";

let worker;

async function initOCR() {
  if (!worker) {
    showStatus("Descargando e inicializando OCR, espere...");
    worker = await Tesseract.createWorker("spa", 1, {
      logger: (m) => console.log(m), // Para depuración en consola
    });
    showStatus("OCR listo. Puede subir su PDF.");
  }
}

async function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  showStatus("Procesando archivo...");

  const fileType = file.type;

  if (fileType === "application/pdf") {
    await processPDF(file);
  } else if (fileType.startsWith("image/")) {
    const imgURL = URL.createObjectURL(file);
    document.getElementById("pdfPreview").src = imgURL;
    await runOCRFields(imgURL);
  } else {
    showStatus("Formato no soportado. Sube un PDF o imagen.");
  }
}

async function processPDF(file) {
  showStatus("Convirtiendo PDF a imagen...");
  const pdfjsLib = window["pdfjs-dist/build/pdf"];
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js";

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  const page = await pdf.getPage(1); // solo la primera página del horario
  const viewport = page.getViewport({ scale: 2 });
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  canvas.width = viewport.width;
  canvas.height = viewport.height;

  await page.render({ canvasContext: context, viewport: viewport }).promise;

  const imgURL = canvas.toDataURL("image/png");
  document.getElementById("pdfPreview").src = imgURL;

  await runOCRFields(imgURL);
}

async function runOCRFields(src) {
  showStatus("Reconociendo texto...");

  const { data: { lines } } = await worker.recognize(src);

  const linesText = lines.map(l => l.text.trim());

  // Buscar los campos específicos del horario
  const fecha = linesText.find(l => /\d{2}\/\d{2}\/\d{4}/.test(l)) || "No encontrada";
  const periodo = linesText.find(l => /\b\d{4}\b/.test(l)) || "No encontrado";
  const estudiante = linesText.find(l => /Estudiante/i.test(l)) || "No encontrado";
  const semestre = linesText.find(l => /Semestre/i.test(l)) || "No encontrado";
  const noControl = linesText.find(l => /(No\.?\s*Control|N°\s*Control)/i.test(l)) || "No encontrado";
  const carrera = linesText.find(l => /Carrera/i.test(l)) || "No encontrada";

  const output = document.getElementById("ocrOutput");
  output.innerHTML = "";
  output.appendChild(createEditableField("Fecha", fecha));
  output.appendChild(createEditableField("Periodo", periodo));
  output.appendChild(createEditableField("Estudiante", estudiante));
  output.appendChild(createEditableField("Semestre", semestre));
  output.appendChild(createEditableField("No. Control", noControl));
  output.appendChild(createEditableField("Carrera", carrera));

  showStatus("OCR completado ✅");
}

// Crear campos editables
function createEditableField(label, value) {
  const div = document.createElement("div");
  div.innerHTML = `<strong>${label}:</strong> <span contenteditable="true">${value}</span>`;
  return div;
}

// Mostrar mensajes al usuario
function showStatus(msg) {
  document.getElementById("status").innerText = msg;
}

document.getElementById("fileInput").addEventListener("change", handleFileUpload);

initOCR();
