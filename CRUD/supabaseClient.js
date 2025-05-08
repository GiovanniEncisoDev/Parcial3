// supabaseClient.js
const { createClient } = require('@supabase/supabase-js');

// Reemplaza con tu URL y clave secreta de Supabase
const supabaseUrl = 'https://<tu-proyecto>.supabase.co';
const supabaseKey = '<clave-secreta>';
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
