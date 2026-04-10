import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const OPENROUTER_API_KEY = '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';

app.post('/api/parsear', async (req, res) => {
  const { texto } = req.body;
  const hoy = new Date().toISOString().split('T')[0];
  const SYSTEM_PROMPT = `Eres un asistente que extrae datos de contactos de predicacion. Devuelve SOLO JSON con estos campos: nombre, sector, metodo_contacto, fecha_contacto (YYYY-MM-DD), temas_interes (array), observaciones, estado (siempre activo), proxima_accion, fecha_proxima_accion (YYYY-MM-DD). Usa null si no puedes inferir. Hoy es ${hoy}.`;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.3-70b-instruct',
        max_tokens: 1000,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: texto }
        ]
      })
    });

    const data = await response.json();
    console.log('Respuesta:', JSON.stringify(data).substring(0, 300));
    const textoRespuesta = data.choices[0].message.content.trim();
    const limpio = textoRespuesta.split('\n').filter(l => !l.startsWith('`')).join('\n').trim();
const resultado = JSON.parse(limpio);
    res.json(resultado);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.listen(3001, () => console.log('Servidor corriendo en http://localhost:3001'));