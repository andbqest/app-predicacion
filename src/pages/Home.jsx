import { useState } from 'react';
import { db } from "../services/supabase";
import { parsearMensaje } from '../services/ai';

export default function Home({ onContactoParsed }) {
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const guardarNuevo = async (datos) => {
  const { error } = await db
    .from('contactos')
    .insert([datos]);

  if (error) {
    console.error("Error al crear:", error);
  } else {
    setPantalla('contactos');
  }
};
  async function handleAnalizar() {
    if (!mensaje.trim()) return;
    
    setCargando(true);
    setError('');

    try {
      // 1. Llamada real a la IA
      const resultado = await parsearMensaje(mensaje);
      
      // 2. Pasamos los datos extraídos a la pantalla de revisión
      onContactoParsed(resultado);
      
    } catch (e) {
      console.error("Error en la conexión:", e);
      setError("No se pudo conectar con la IA. Asegúrate de que el servidor esté encendido (npx wrangler dev --remote).");
    } finally {
      setCargando(false);
    }
  }

  return (
    <div style={{ padding: '24px', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '22px', fontWeight: '500', marginBottom: '8px' }}>
        Nueva persona contactada
      </h1>
      <p style={{ color: '#666', fontSize: '14px', marginBottom: '24px' }}>
        Escribe tu nota como quieras. La IA organiza los datos automáticamente.
      </p>

      <textarea
        value={mensaje}
        onChange={e => setMensaje(e.target.value)}
        placeholder="Ejemplo: Hoy hablé con Pedro Ramírez sobre el sufrimiento..."
        style={{
          width: '100%',
          height: '180px',
          padding: '12px',
          fontSize: '15px',
          border: '1px solid #ddd',
          borderRadius: '8px',
          resize: 'vertical',
          fontFamily: '"Inter", sans-serif',
          boxSizing: 'border-box'
        }}
      />

      {error && (
        <p style={{ color: '#c0392b', fontSize: '14px', marginTop: '8px' }}>
          ⚠️ {error}
        </p>
      )}

      <button
        onClick={handleAnalizar}
        disabled={cargando || !mensaje.trim()}
        style={{
          marginTop: '16px',
          width: '100%',
          padding: '14px',
          fontSize: '16px',
          fontWeight: '500',
          backgroundColor: cargando ? '#aaa' : '#4A4AE8',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: cargando ? 'not-allowed' : 'pointer'
        }}
      >
        {cargando ? 'Analizando...' : 'Analizar mensaje'}
      </button>
    </div>
  );
}