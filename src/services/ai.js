export const parsearMensaje = async (texto) => {
  try {
    const response = await fetch("https://servidor-predicacion.sanfernando-predicacion.workers.dev", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texto }),
    });

    const data = await response.json();
    
    // Extraemos la respuesta de la IA
    let contenidoIA = data.response || data;

    // Si es un texto, buscamos el JSON dentro de las llaves { }
    if (typeof contenidoIA === 'string') {
      const coincidencia = contenidoIA.match(/\{[\s\S]*\}/);
      if (coincidencia) {
        return JSON.parse(coincidencia[0]);
      }
    }
    return contenidoIA;
  } catch (error) {
    console.error("Error en la App:", error);
    throw error;
  }
};