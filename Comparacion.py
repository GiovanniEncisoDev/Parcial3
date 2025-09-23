import os

# Rutas de las carpetas originales
original1 = r"D:\IMG\Camera"
original2 = r"D:\IMG\Paisaje"
# Carpeta de backup
backup = r"C:\Users\Giovanni Enciso\Desktop\Nueva carpeta\Disco\Backup\Paisaje"

# Función para listar todos los archivos con ruta relativa
def listar_archivos(ruta_base):
    archivos = []
    for root, _, files in os.walk(ruta_base):
        for f in files:
            ruta_relativa = os.path.relpath(os.path.join(root, f), ruta_base)
            archivos.append(ruta_relativa)
    return set(archivos)

# Listamos archivos de cada carpeta original
archivos_original1 = listar_archivos(original1)
archivos_original2 = listar_archivos(original2)
archivos_backup = listar_archivos(backup)

# Función para verificar faltantes con su carpeta original
def faltantes_por_origen(original_set, nombre_carpeta):
    faltantes = original_set - archivos_backup
    return [(f, nombre_carpeta) for f in faltantes]

# Archivos faltantes de cada carpeta original
faltantes = faltantes_por_origen(archivos_original1, "Camera") + faltantes_por_origen(archivos_original2, "OtraCarpeta")

# Archivos extra en backup (opcionales)
extras = archivos_backup - (archivos_original1.union(archivos_original2))

# Generar archivo de log
log_path = r"C:\Users\Giovanni Enciso\Desktop\Nueva carpeta\Disco\Backup\comparacion_backup_log.txt"
with open(log_path, "w", encoding="utf-8") as log:
    log.write("=== Archivos faltantes en la copia ===\n")
    for f, origen in sorted(faltantes, key=lambda x: x[0]):
        log.write(f"{f}  (Origen: {origen})\n")
    
    log.write("\n=== Archivos extra en la copia ===\n")
    for f in sorted(extras):
        log.write(f"{f}\n")

print(f"Comparación completada. Log generado en:\n{log_path}")
