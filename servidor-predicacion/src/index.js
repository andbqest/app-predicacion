export default {
  async fetch(request, env) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

    try {
      const { texto } = await request.json();

      const aiResponse = await env.AI.run("@cf/meta/llama-3-8b-instruct", {
        messages: [
          { 
            role: "system", 
            content: "Responde estrictamente con un objeto JSON. Extrae: 'nombre', 'fecha', 'hora', 'lugar', 'observaciones', 'proxima_accion', 'temas_interes' (como lista). Si falta un dato, pon ''."
          },
          { role: "user", content: texto }
        ],
      });

      return new Response(JSON.stringify(aiResponse), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });

    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: corsHeaders });
    }
  },
};