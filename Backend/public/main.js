const API_URL = 'http://localhost:3000/peliculas';

let editando = false;
let peliculaEditandoId = null;

async function cargarPeliculas() {
  const res = await fetch(API_URL);
  const peliculas = await res.json();

  const tbody = document.querySelector('#tablaPeliculas tbody');
  tbody.innerHTML = '';

  peliculas.forEach(p => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${p.idPelicula}</td>
      <td>${p.titulo}</td>
      <td>${p.director}</td>
      <td>${p.genero}</td>
      <td>${p.anio}</td>
      <td><img src="${p.imagen || ''}" alt="img" width="50"></td>
      <td><a href="${p.url || '#'}" target="_blank">Ver</a></td>
      <td><button onclick="eliminar(${p.idPelicula})">Eliminar</button></td>
    `;

    fila.addEventListener('click', () => cargarEnFormulario(p));
    tbody.appendChild(fila);
  });
}

function cargarEnFormulario(p) {
  document.getElementById('titulo').value = p.titulo;
  document.getElementById('director').value = p.director;
  document.getElementById('genero').value = p.genero;
  document.getElementById('anio').value = p.anio;
  document.getElementById('imagen').value = p.imagen || '';
  document.getElementById('url').value = p.url || '';

  editando = true;
  peliculaEditandoId = p.idPelicula;

  document.getElementById('btnGuardar').textContent = 'Modificar';
  document.getElementById('btnCancelar').style.display = 'inline-block';
}

document.getElementById('formAgregar').addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = {
    titulo: document.getElementById('titulo').value,
    director: document.getElementById('director').value,
    genero: document.getElementById('genero').value,
    anio: document.getElementById('anio').value,
    imagen: document.getElementById('imagen').value,
    url: document.getElementById('url').value,
  };

  let res;
  if (editando) {
    res = await fetch(`${API_URL}/${peliculaEditandoId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  } else {
    res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  }

  if (res.ok) {
    cargarPeliculas();
    limpiarFormulario();
  } else {
    alert('Error al guardar la película');
  }
});

async function eliminar(id) {
  if (!confirm('¿Estás seguro de eliminar esta película?')) return;
  const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  if (res.ok) cargarPeliculas();
}

function limpiarFormulario() {
  document.getElementById('formAgregar').reset();
  editando = false;
  peliculaEditandoId = null;
  document.getElementById('btnGuardar').textContent = 'Agregar';
  document.getElementById('btnCancelar').style.display = 'none';
}

document.getElementById('btnCancelar').addEventListener('click', (e) => {
  e.preventDefault();
  limpiarFormulario();
});

cargarPeliculas();
