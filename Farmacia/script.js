document.addEventListener('DOMContentLoaded', () => {
    cargarProductos();

    document.getElementById('form-producto').addEventListener('submit', agregarProducto);

    // Toggle sidebar
    document.getElementById('menu-toggle').addEventListener('click', () => {
        document.getElementById('sidebar').classList.toggle('active');
    });

    // Toggle user dropdown
    document.getElementById('user-menu-toggle').addEventListener('click', () => {
        const menu = document.getElementById('dropdown-menu');
        menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
    });
});

function cargarProductos() {
    fetch('obtener_productos.php')
        .then(res => res.json())
        .then(data => {
            const tabla = document.getElementById('tabla-productos');
            tabla.innerHTML = '';
            data.forEach(prod => {
                const fila = document.createElement('tr');
                fila.innerHTML = `
                    <td>${prod.codigo}</td>
                    <td>${prod.nombre}</td>
                    <td>$${prod.precio}</td>
                    <td>${prod.cantidad}</td>
                    <td>${prod.depto_codigo}</td>
                    <td>${prod.proveedor_codigo}</td>
                    <td><button onclick="eliminarProducto('${prod.codigo}')">❌</button></td>
                `;
                tabla.appendChild(fila);
            });
        });
}

function agregarProducto(e) {
    e.preventDefault();

    const producto = {
        codigo: document.getElementById('codigo').value,
        nombre: document.getElementById('nombre').value,
        precio: parseFloat(document.getElementById('precio').value),
        cantidad: parseInt(document.getElementById('cantidad').value),
        depto_codigo: document.getElementById('depto').value,
        proveedor_codigo: document.getElementById('proveedor').value
    };

    fetch('agregar_producto.php', {
        method: 'POST',
        body: JSON.stringify(producto)
    }).then(() => {
        cargarProductos();
        document.getElementById('form-producto').reset();
    });
}

function eliminarProducto(codigo) {
    fetch('eliminar_producto.php', {
        method: 'POST',
        body: JSON.stringify({ codigo })
    }).then(() => cargarProductos());
}
