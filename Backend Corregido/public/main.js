const API_URL = 'http://localhost:3000/peliculas';

let modoEdicion = false;
let idEditar = null;

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
      <td>
        <button onclick='prepararEdicion(${JSON.stringify(p)})'>Modificar</button>
        <button onclick="eliminar(${p.idPelicula})">Eliminar</button>
      </td>
    `;
    tbody.appendChild(fila);
  });
}

document.getElementById('formAgregar').addEventListener('submit', async (e) => {
  e.preventDefault();

  const data = {
    titulo: document.getElementById('titulo').value,
    director: document.getElementById('director').value,
    genero: document.getElementById('genero').value,
    anio: parseInt(document.getElementById('anio').value),
    imagen: document.getElementById('imagen').value,
    url: document.getElementById('url').value,
  };

  if (!modoEdicion) {
    // Agregar nueva
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      cargarPeliculas();
      e.target.reset();
    } else {
      alert('❌ Error al agregar la película');
    }
  } else {
    // Confirmación antes de modificar
    if (!confirm('¿Seguro que deseas guardar los cambios de esta película?')) return;

    const res = await fetch(`${API_URL}/${idEditar}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      cargarPeliculas();
      e.target.reset();
      document.querySelector('#formAgregar button').textContent = 'Agregar';
      modoEdicion = false;
      idEditar = null;
    } else {
      alert('❌ Error al modificar la película');
    }
  }
});

function prepararEdicion(pelicula) {
  document.getElementById('titulo').value = pelicula.titulo;
  document.getElementById('director').value = pelicula.director;
  document.getElementById('genero').value = pelicula.genero;
  document.getElementById('anio').value = pelicula.anio;
  document.getElementById('imagen').value = pelicula.imagen || '';
  document.getElementById('url').value = pelicula.url || '';

  modoEdicion = true;
  idEditar = pelicula.idPelicula;
  document.querySelector('#formAgregar button').textContent = 'Guardar cambios';

  // Scroll automático al formulario
  document.getElementById('formularioBox').scrollIntoView({ behavior: 'smooth' });
}

async function eliminar(id) {
  if (!confirm('⚠️ ¿Estás seguro de eliminar esta película?')) return;

  const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  if (res.ok) {
    cargarPeliculas();
  } else {
    alert('❌ Error al eliminar la película');
  }
}

cargarPeliculas();
