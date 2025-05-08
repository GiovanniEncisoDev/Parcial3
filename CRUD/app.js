const supabase = require('./supabaseClient');

// Obtener películas
app.get('/peliculas', async (req, res) => {
  const { data, error } = await supabase.from('peliculas').select('*');
  if (error) return res.status(500).json({ error });
  res.json(data);
});

// Agregar nueva película
app.post('/peliculas', async (req, res) => {
  const nueva = req.body;
  const { data, error } = await supabase.from('peliculas').insert([nueva]);
  if (error) return res.status(500).json({ error });
  res.json(data);
});

// Eliminar película
app.delete('/peliculas/:id', async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('peliculas').delete().eq('idPelicula', id);
  if (error) return res.status(500).json({ error });
  res.send('Eliminado');
});
