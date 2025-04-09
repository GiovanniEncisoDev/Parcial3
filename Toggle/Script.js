// Selecciona todas las cajas
const cajas = document.querySelectorAll('.caja');

// Agrega evento a cada caja para hacerla transparente
cajas.forEach(caja => {
  caja.addEventListener('click', () => {
    caja.classList.toggle('cajaClick');
  });
});

// Botón para limpiar (restaurar todas las cajas)
document.getElementById('btnLimpiar').addEventListener('click', () => {
  cajas.forEach(caja => caja.classList.remove('cajaClick'));
});
