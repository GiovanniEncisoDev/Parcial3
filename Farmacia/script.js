document.addEventListener('DOMContentLoaded', () => {
    cargarProductos();

    document.getElementById('form-producto').addEventListener('submit', agregarProducto);

    // Mostrar productos por defecto
    mostrarSeccion('productos');

    // Toggle sidebar
    document.getElementById('menu-toggle').addEventListener('click', () => {
        document.getElementById('sidebar').classList.toggle('active');
        // Ajusta margen main-content
        document.getElementById('main-content').classList.toggle('shifted');
    });

    // Toggle user dropdown
    document.getElementById('user-menu-toggle').addEventListener('click', () => {
        const menu = document.getElementById('dropdown-menu');
        const isVisible = menu.style.display === 'block';
        menu.style.display = isVisible ? 'none' : 'block';
        // Aria-expanded toggle
        document.getElementById('user-menu-toggle').setAttribute('aria-expanded', !isVisible);
    });

    // Botones menú lateral
    document.getElementById('btn-productos').addEventListener('click', () => {
        mostrarSeccion('productos');
        cargarProductos();
    });

    document.getElementById('btn-departamentos').addEventListener('click', () => {
        mostrarSeccion('departamentos');
        cargarDepartamentos();
    });

    document.getElementById('btn-proveedores').addEventListener('click', () => {
        mostrarSeccion('proveedores');
        cargarProveedores();
    });
});

function mostrarSeccion(seccion) {
    // Oculta todas las secciones
    document.getElementById('tabla-productos').parentElement.style.display = 'none';
    document.getElementById('seccion-departamentos').style.display = 'none';
    document.getElementById('seccion-proveedores').style.display = 'none';

    switch (seccion) {
        case 'productos':
            document.getElementById('tabla-productos').parentElement.style.display = 'table';
            break;
        case 'departamentos':
            document.getElementById('seccion-departamentos').style.display = 'block';
            break;
        case 'proveedores':
            document.getElementById('seccion-proveedores').style.display = 'block';
            break;
    }
}

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
                    <td>$${prod.precio.toFixed(2)}</td>
                    <td>${prod.cantidad}</td>
                    <td>${prod.depto_codigo}</td>
                    <td>${prod.proveedor_codigo}</td>
                    <td><button onclick="eliminarProducto('${prod.codigo}')">❌</button></td>
                `;
                tabla.appendChild(fila);
            });
        })
        .catch(err => console.error('Error al cargar productos:', err));
}

function cargarDepartamentos() {
    fetch('obtener_departamentos.php')
        .then(res => res.json())
        .then(data => {
            const tabla = document.getElementById('tabla-departamentos');
            tabla.innerHTML = '';
            data.forEach(dep => {
                tabla.innerHTML += `<tr>
                    <td>${dep.codigo}</td>
                    <td>${dep.departamento}</td>
                </tr>`;
            });
        })
        .catch(err => console.error('Error al cargar departamentos:', err));
}

function cargarProveedores() {
    fetch('obtener_proveedores.php')
        .then(res => res.json())
        .then(data => {
            const tabla = document.getElementById('tabla-proveedores');
            tabla.innerHTML = '';
            data.forEach(prov => {
                tabla.innerHTML += `<tr>
                    <td>${prov.codigo}</td>
                    <td>${prov.nombre_empresa}</td>
                    <td>${prov.rfc}</td>
                    <td>${prov.direccion}</td>
                    <td>${prov.telefono}</td>
                    <td>${prov.ciudad}</td>
                </tr>`;
            });
        })
        .catch(err => console.error('Error al cargar proveedores:', err));
}

function agregarProducto(e) {
    e.preventDefault();

    const producto = {
        codigo: document.getElementById('codigo').value.trim(),
        nombre: document.getElementById('nombre').value.trim(),
        precio: parseFloat(document.getElementById('precio').value),
        cantidad: parseInt(document.getElementById('cantidad').value),
        depto_codigo: document.getElementById('depto').value.trim(),
        proveedor_codigo: document.getElementById('proveedor').value.trim()
    };

    // Validación básica antes de enviar
    if (!producto.codigo || !producto.nombre || isNaN(producto.precio) || isNaN(producto.cantidad) || !producto.depto_codigo || !producto.proveedor_codigo) {
        alert('Por favor llena todos los campos correctamente.');
        return;
    }

    fetch('agregar_producto.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(producto)
    })
    .then(res => {
        if (!res.ok) throw new Error('Error al agregar producto');
        return res.json();
    })
    .then(() => {
        cargarProductos();
        e.target.reset();
    })
    .catch(err => alert(err.message));
}

function eliminarProducto(codigo) {
    if (!confirm(`¿Seguro que quieres eliminar el producto con código ${codigo}?`)) return;

    fetch('eliminar_producto.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codigo })
    })
    .then(res => {
        if (!res.ok) throw new Error('Error al eliminar producto');
        return res.json();
    })
    .then(() => cargarProductos())
    .catch(err => alert(err.message));
}

function cerrarSesion() {
    // Aquí puedes implementar el cierre de sesión
    alert('Función de cierre de sesión no implementada.');
}
