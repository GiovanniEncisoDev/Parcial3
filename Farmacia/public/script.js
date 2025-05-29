const apiUrl = '/api/medicamentos';

const form = document.getElementById('medicamento-form');
const cancelarBtn = document.getElementById('cancelar-edicion');
const formTitulo = document.getElementById('form-titulo');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const id = document.getElementById('id_medicamento').value;
  const nombre = document.getElementById('nombre').value;
  const descripcion = document.getElementById('descripcion').value;
  const dosis = document.getElementById('dosis').value;

  const data = { nombre, descripcion, dosis };

  try {
    if (id) {
      // Editar
      await fetch(`${apiUrl}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    } else {
      // Agregar nuevo
      await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    }

    form.reset();
    cancelarBtn.style.display = 'none';
    formTitulo.textContent = 'Agregar Medicamento';
    cargarMedicamentos();
  } catch (err) {
    alert('Error al guardar el medicamento');
    console.error(err);
  }
});

cancelarBtn.addEventListener('click', () => {
  form.reset();
  document.getElementById('id_medicamento').value = '';
  cancelarBtn.style.display = 'none';
  formTitulo.textContent = 'Agregar Medicamento';
});

async function cargarMedicamentos() {
  const container = document.getElementById('medicamentos-container');
  container.innerHTML = 'Cargando...';

  try {
    const res = await fetch(apiUrl);
    const medicamentos = await res.json();

    if (!medicamentos.length) {
      container.innerHTML = '<p>No hay medicamentos registrados.</p>';
      return;
    }

    container.innerHTML = '';
    medicamentos.forEach(med => {
      const div = document.createElement('div');
      div.className = 'medicamento';
      div.innerHTML = `
        <h3>${med.nombre}</h3>
        <p><strong>Descripción:</strong> ${med.descripcion}</p>
        <p><strong>Dosis:</strong> ${med.dosis}</p>
        <button onclick="editar(${med.id_medicamento}, '${med.nombre}', '${med.descripcion}', '${med.dosis}')">Editar</button>
        <button onclick="eliminar(${med.id_medicamento})">Eliminar</button>
      `;
      container.appendChild(div);
    });
  } catch (err) {
    console.error(err);
    container.innerHTML = '<p>Error al cargar los medicamentos.</p>';
  }
}

function editar(id, nombre, descripcion, dosis) {
  document.getElementById('id_medicamento').value = id;
  document.getElementById('nombre').value = nombre;
  document.getElementById('descripcion').value = descripcion;
  document.getElementById('dosis').value = dosis;
  cancelarBtn.style.display = 'inline-block';
  formTitulo.textContent = 'Editar Medicamento';
}

async function eliminar(id) {
  if (confirm('¿Estás seguro de eliminar este medicamento?')) {
    try {
      await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
      cargarMedicamentos();
    } catch (err) {
      alert('Error al eliminar');
      console.error(err);
    }
  }
}

cargarMedicamentos();
