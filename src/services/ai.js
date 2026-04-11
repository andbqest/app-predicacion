export async function parsearMensaje(texto) {
  const response = await fetch('https://app-predicacion-production.up.railway.app/api/parsear', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ texto })
  });

  if (!response.ok) {
    throw new Error('Error al conectar con el servidor.');
  }

  const datos = await response.json();

  if (datos.error) {
    throw new Error('No se pudo interpretar el mensaje. Intenta ser más específico.');
  }

  return datos;
}