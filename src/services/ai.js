export async function parsearMensaje(texto) {
  const response = await fetch('http://localhost:3001/api/parsear', {
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