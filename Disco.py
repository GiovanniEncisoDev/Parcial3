import os

# Ruta del disco dañado (ajústala a tu caso)
ruta = r"D:\IMG\SD\Tachiyomi\LectorManga (ES)"

# Archivo donde se guardará la lista
salida = "Tachiyomi LectorManga.txt"

with open(salida, "w", encoding="utf-8") as f:
    for carpeta, subcarpetas, archivos in os.walk(ruta):
        for archivo in archivos:
            f.write(archivo + "\n")

print(f"Lista guardada en: {salida}")
