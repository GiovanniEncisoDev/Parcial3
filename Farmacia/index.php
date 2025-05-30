<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8" />
    <title>Inventario Farmacia</title>
    <link rel="stylesheet" href="style.css" />
</head>
<body>
    <!-- Encabezado superior -->
    <header>
        <button id="menu-toggle" class="hamburger" aria-label="Toggle menu">☰</button>
        <div class="user-info">
            <div class="user-details">
                <span>Nombre: Juan Pérez</span><br />
                <span>Empleado: 12345</span>
            </div>
            <div class="user-photo"></div>
            <div class="dropdown">
                <button id="user-menu-toggle" aria-haspopup="true" aria-expanded="false">▼</button>
                <ul class="dropdown-menu" id="dropdown-menu" role="menu" aria-label="User menu">
                    <li role="menuitem" tabindex="0" onclick="cerrarSesion()">Cerrar sesión</li>
                </ul>
            </div>
        </div>
    </header>

    <!-- Menú lateral -->
    <nav class="sidebar" id="sidebar" aria-label="Menú lateral">
        <ul>
            <li id="btn-productos" tabindex="0" role="button">Productos</li>
            <li id="btn-proveedores" tabindex="0" role="button">Proveedores</li>
            <li id="btn-departamentos" tabindex="0" role="button">Departamentos</li>
            <li id="btn-usuarios" tabindex="0" role="button">Usuarios</li>
        </ul>
    </nav>

    <main id="main-content" tabindex="-1">
        <h1>Inventario de Productos</h1>

        <form id="form-producto">
            <input type="text" placeholder="Código" id="codigo" name="codigo" required />
            <input type="text" placeholder="Nombre" id="nombre" name="nombre" required />
            <input type="number" placeholder="Precio" id="precio" name="precio" step="0.01" min="0" required />
            <input type="number" placeholder="Cantidad" id="cantidad" name="cantidad" min="0" required />
            <input type="text" placeholder="Depto (ej. B0001)" id="depto" name="depto" required />
            <input type="text" placeholder="Proveedor (ej. P001)" id="proveedor" name="proveedor" required />
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

        <section id="seccion-departamentos" class="seccion-oculta" aria-live="polite">
            <h2>Departamentos</h2>
            <table>
                <thead>
                    <tr>
                        <th>Código</th>
                        <th>Nombre</th>
                    </tr>
                </thead>
                <tbody id="tabla-departamentos"></tbody>
            </table>
        </section>

        <section id="seccion-proveedores" class="seccion-oculta" aria-live="polite">
            <h2>Proveedores</h2>
            <table>
                <thead>
                    <tr>
                        <th>Código</th>
                        <th>Empresa</th>
                        <th>RFC</th>
                        <th>Dirección</th>
                        <th>Teléfono</th>
                        <th>Ciudad</th>
                    </tr>
                </thead>
                <tbody id="tabla-proveedores"></tbody>
            </table>
        </section>
    </main>

    <script src="script.js"></script>
</body>
</html>
