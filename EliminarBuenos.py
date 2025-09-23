import os

# Rutas de las carpetas originales (disco malo)
original_paths = {
    "Camera": r"D:\IMG\Camera",
    "OtraCarpeta": r"D:\IMG\Paisaje"
}

# Log detallado generado previamente
log_path = r"C:\Users\Giovanni Enciso\Desktop\Nueva carpeta\Disco\Backup\comparacion_backup_log.txt"

# Leer archivos faltantes del log y guardar sus rutas completas
faltantes = set()
with open(log_path, "r", encoding="utf-8") as log:
    for line in log:
        line = line.strip()
        if "| Origen:" in line and "| Ruta completa:" in line:
            # Extraemos ruta completa
            ruta_completa = line.split("| Ruta completa:")[1].strip()
            faltantes.add(ruta_completa)

# Recorrer originales y eliminar solo los archivos que NO están en faltantes
for carpeta, ruta_base in original_paths.items():
    for root, _, files in os.walk(ruta_base):
        for f in files:
            ruta_actual = os.path.join(root, f)
            # Si el archivo NO está en la lista de faltantes, se puede eliminar
            if ruta_actual not in faltantes:
                try:
                    os.remove(ruta_actual)
                    print(f"Eliminado: {ruta_actual}")
                except Exception as e:
                    print(f"Error eliminando {ruta_actual}: {e}")

print("Proceso completado. Solo quedaron los archivos que fallaron en copiar.")
