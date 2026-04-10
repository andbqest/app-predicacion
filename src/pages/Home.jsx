import { useState } from 'react';
import { parsearMensaje } from '../services/ai';

export default function Home({ onContactoParsed }) {
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  async function handleAnalizar() {
    if (!mensaje.trim()) return;
    setCargando(true);
    setError('');
    try {
      const datos = await parsearMensaje(mensaje);
      onContactoParsed(datos);
    } catch (e) {
      setError(e.message);
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
        placeholder="Ejemplo: Hoy hablé con María González en el sector norte cerca del parque. Le interesa mucho el tema de la vida después de la muerte. Quedamos en volver el próximo sábado con una revista."
        style={{
          width: '100%',
          height: '180px',
          padding: '12px',
          fontSize: '15px',
          border: '1px solid #ddd',
          borderRadius: '8px',
          resize: 'vertical',
          fontFamily: 'inherit',
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