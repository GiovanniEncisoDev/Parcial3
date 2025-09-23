import os

# Ruta del disco dañado (ajústala a tu caso)
ruta = r"D:\IMG\SD\Tachiyomi\TMOHentai (ES)"

# Archivo donde se guardará la lista de carpetas
salida = "Tachiyomi TMOH.txt"

with open(salida, "w", encoding="utf-8") as f:
    for carpeta, subcarpetas, archivos in os.walk(ruta):
        # Escribe el nombre de la carpeta actual
        f.write(carpeta + "\n")

print(f"Lista de carpetas guardada en: {salida}")
