<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Inventario Farmacia</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <!-- Menú lateral -->
    <div class="sidebar" id="sidebar">
        <ul>
            <li>Productos</li>
            <li>Proveedores</li>
            <li>Departamentos</li>
            <li>Usuarios</li>
        </ul>
    </div>

    <!-- Encabezado superior -->
    <header>
        <button id="menu-toggle" class="hamburger">☰</button>
        <div class="user-info">
            <div class="user-details">
                <span>Nombre: Juan Pérez</span><br>
                <span>Empleado: 12345</span>
            </div>
            <div class="user-photo"></div>
            <div class="dropdown" id="user-dropdown">
                <button id="user-menu-toggle">▼</button>
                <ul class="dropdown-menu" id="dropdown-menu">
                    <li>Cerrar sesión</li>
                </ul>
            </div>
        </div>
    </header>

    <main>
        <h1>Inventario de Productos</h1>

        <form id="form-producto">
            <input type="text" placeholder="Código" id="codigo" required>
            <input type="text" placeholder="Nombre" id="nombre" required>
            <input type="number" placeholder="Precio" id="precio" step="0.01" required>
            <input type="number" placeholder="Cantidad" id="cantidad" required>
            <input type="text" placeholder="Depto (ej. B0001)" id="depto" required>
            <input type="text" placeholder="Proveedor (ej. P001)" id="proveedor" required>
            <button type="submit">Agregar</button>
        </form>

        <table>
            <thead>
                <tr>
                    <th>Código</th>
                    <th>Nombre</th>
                    <th>Precio</th>
                    <th>Cantidad</th>
                    <th>Depto</th>
                    <th>Proveedor</th>
                    <th>Eliminar</th>
                </tr>
            </thead>
            <tbody id="tabla-productos"></tbody>
        </table>
    </main>

    <script src="script.js"></script>
</body>
</html>
