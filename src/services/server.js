import express from "express";
import cors from "cors";
const app = express();
app.use(cors());
app.use(express.json());
const KEY = "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";

const MODELOS = [
  "arcee-ai/trinity-large-preview:free",
  "nvidia/nemotron-3-super-120b-a12b:free"
];

async function llamarIA(texto) {
  const hoy = new Date().toISOString().split("T")[0];
  const prompt = "Respond ONLY with valid JSON no markdown no backticks no explanation. Extract: {nombre,sector,metodo_contacto,fecha_contacto,temas_interes,observaciones,estado,proxima_accion,fecha_proxima_accion}. Today:" + hoy + ". Text:";

  for (const modelo of MODELOS) {
    try {
      console.log("Intentando modelo:", modelo);
      const r = await fetch("https://servidor-predicacion.sanfernando-predicacion.workers.dev", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer " + KEY },
        body: JSON.stringify({ model: modelo, max_tokens: 1000, messages: [{ role: "user", content: prompt + " " + texto }] })
      });
      const d = await r.json();
      if (!d.choices || !d.choices[0]) {
        console.log("Modelo fallido:", modelo, JSON.stringify(d).substring(0, 100));
        continue;
      }
      const content = d.choices[0].message.content.trim();
      console.log("Respuesta:", content.substring(0, 200));
      const start = content.indexOf("{");
      const end = content.lastIndexOf("}");
      if (start === -1 || end === -1) continue;
      return JSON.parse(content.substring(start, end + 1));
    } catch (e) {
      console.log("Error con modelo:", modelo, e.message);
    }
  }
  throw new Error("Ningún modelo disponible");
}

app.post("/api/parsear", async (req, res) => {
  try {
    const resultado = await llamarIA(req.body.texto);
    res.json(resultado);
  } catch (e) {
    console.error("err:", e.message);
    res.status(500).json({ error: e.message });
  }
});

app.listen(3001, () => console.log("ok 3001"));