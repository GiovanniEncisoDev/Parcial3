document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("medicamentoForm");
  const tabla = document.getElementById("tablaMedicamentos");

  // Cargar medicamentos existentes
  fetch("/api/medicamentos")
    .then(res => res.json())
    .then(data => {
      data.forEach(med => agregarFila(med));
    });

  // Manejar envío del formulario
  form.addEventListener("submit", e => {
    e.preventDefault();
    const nombre = document.getElementById("nombre").value;
    const descripcion = document.getElementById("descripcion").value;
    const dosis = document.getElementById("dosis").value;

    fetch("/api/medicamentos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, descripcion, dosis })
    })
    .then(res => res.json())
    .then(med => {
      agregarFila(med);
      form.reset();
    })
    .catch(err => console.error("Error:", err));
  });

  function agregarFila(med) {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${med.id_medicamento}</td>
      <td>${med.nombre}</td>
      <td>${med.descripcion || ""}</td>
      <td>${med.dosis || ""}</td>
    `;
    tabla.appendChild(fila);
  }
});
