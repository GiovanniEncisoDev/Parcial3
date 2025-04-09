let presidentes = [];

// Función para mostrar los presidentes en una lista
function mostrarPresidentes() {
  const contenedor = document.getElementById('contenedor');
  contenedor.innerHTML = ''; // Limpia lo anterior

  let lista = document.createElement('ul');

  presidentes.forEach(presidente => {
    let item = document.createElement('li');
    let texto = document.createTextNode(
      `Nombre: ${presidente.nombre}, Lugar de nacimiento: ${presidente.lugar_nacimiento}`
    );
    item.appendChild(texto);
    lista.appendChild(item);
  });

  contenedor.appendChild(lista);
}

// Cargar los datos iniciales desde un archivo JSON
fetch('_Presidentes.json')
  .then(response => response.json())
  .then(data => {
    presidentes = data;        // Guarda los datos en la variable
    mostrarPresidentes();      // Muestra la lista al cargar
  })
  .catch(error => {
    console.error('Error al cargar el JSON:', error);
  });

// Evento para agregar un nuevo presidente al hacer clic en el botón
document.getElementById('agregarBtn').addEventListener('click', () => {
  const nombre = document.getElementById('nombre').value.trim();
  const lugar = document.getElementById('lugar').value.trim();

  if (nombre && lugar) {
    const nuevoPresidente = {
      nombre: nombre,
      lugar_nacimiento: lugar
    };

    presidentes.push(nuevoPresidente); // Agrega al arreglo
    mostrarPresidentes();              // Vuelve a mostrar la lista actualizada

    // Limpia los campos del formulario
    document.getElementById('nombre').value = '';
    document.getElementById('lugar').value = '';
  } else {
    alert('Por favor, llena ambos campos');
  }
});
