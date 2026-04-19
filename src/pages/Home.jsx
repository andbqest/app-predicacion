import { useState } from 'react';
import { db } from "../services/supabase";
import { parsearMensaje } from '../services/ai';

export default function Home({ onContactoParsed }) {
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  // Eliminamos 'guardarNuevo' de aquí porque Home solo se encarga de analizar.
  // El guardado final ocurre en la pantalla de Review.

  async function handleAnalizar() {
    if (!mensaje.trim()) return;
    
    setCargando(true);
    setError('');

    try {
      // 1. Llamada a la IA para procesar el texto
      const resultado = await parsearMensaje(mensaje);
      
      // 2. Enviamos el resultado a App.jsx
      // App.jsx recibirá esto y cambiará automáticamente a la pantalla 'revision'
      if (resultado) {
        onContactoParsed(resultado);
      } else {
        setError("La IA no pudo extraer datos válidos. Intenta escribir más detalles.");
      }
      
    } catch (e) {
      console.error("Error en la conexión con IA:", e);
      setError("No se pudo conectar con la IA. Revisa la consola para más detalles.");
    } finally {
      setCargando(false);
    }
  }

  return (
    <div style={{ padding: '24px', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '8px', color: '#1C1E21' }}>
        Nueva persona contactada
      </h1>
      <p style={{ color: '#65676B', fontSize: '14px', marginBottom: '24px' }}>
        Escribe tu nota como quieras. La IA organiza los datos automáticamente.
      </p>

      <textarea
        value={mensaje}
        onChange={e => setMensaje(e.target.value)}
        placeholder="Ejemplo: Hoy hablé con Pedro Ramírez sobre el sufrimiento. Su teléfono es 0412..."
        style={{
          width: '100%',
          height: '180px',
          padding: '16px',
          fontSize: '16px',
          border: '1px solid #ddd',
          borderRadius: '12px',
          resize: 'none',
          fontFamily: 'inherit',
          boxSizing: 'border-box',
          backgroundColor: '#fff',
          boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)'
        }}
      />

      {error && (
        <p style={{ color: '#d93025', fontSize: '14px', marginTop: '12px', fontWeight: '500' }}>
          ⚠️ {error}
        </p>
      )}

      <button
        onClick={handleAnalizar}
        disabled={cargando || !mensaje.trim()}
        style={{
          marginTop: '20px',
          width: '100%',
          padding: '16px',
          fontSize: '16px',
          fontWeight: '700',
          backgroundColor: cargando ? '#E4E6EB' : '#4A4AE8',
          color: cargando ? '#bcc0c4' : 'white',
          border: 'none',
          borderRadius: '12px',
          cursor: cargando ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s ease'
        }}
      >
        {cargando ? 'Analizando con IA...' : 'Analizar mensaje'}
      </button>
    </div>
  );
}