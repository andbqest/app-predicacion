import { useState } from 'react';
import Home from './pages/Home';
import Review from './pages/Review';
import Contacts from './pages/Contacts';
import Detail from './pages/Detail';

export default function App() {
  const [pantalla, setPantalla] = useState('contactos');
  const [contactoParsed, setContactoParsed] = useState(null);
  const [contactoSeleccionado, setContactoSeleccionado] = useState(null);

  function handleContactoParsed(datos) {
    setContactoParsed(datos);
    setPantalla('revision');
  }

  function handleGuardado() {
    setContactoParsed(null);
    setPantalla('contactos');
  }

  function handleVerDetalle(contacto) {
    setContactoSeleccionado(contacto);
    setPantalla('detalle');
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f8f8', fontFamily: 'system-ui, sans-serif' }}>

      {/* Barra de navegación */}
      <div style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #eee',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '56px',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <span style={{ fontWeight: '600', fontSize: '16px', color: '#4A4AE8' }}>
          📖 Predicación
        </span>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setPantalla('contactos')}
            style={{
              padding: '8px 16px',
              fontSize: '14px',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              backgroundColor: pantalla === 'contactos' ? '#4A4AE8' : 'transparent',
              color: pantalla === 'contactos' ? 'white' : '#666',
              fontWeight: pantalla === 'contactos' ? '500' : '400'
            }}
          >
            Contactos
          </button>
          <button
            onClick={() => setPantalla('nuevo')}
            style={{
              padding: '8px 16px',
              fontSize: '14px',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              backgroundColor: pantalla === 'nuevo' ? '#4A4AE8' : 'transparent',
              color: pantalla === 'nuevo' ? 'white' : '#666',
              fontWeight: pantalla === 'nuevo' ? '500' : '400'
            }}
          >
            + Nuevo
          </button>
        </div>
      </div>

      {/* Contenido según pantalla */}
      {pantalla === 'nuevo' && (
        <Home onContactoParsed={handleContactoParsed} />
      )}
      {pantalla === 'revision' && contactoParsed && (
        <Review
          contacto={contactoParsed}
          onGuardado={handleGuardado}
          onCancelar={() => setPantalla('nuevo')}
        />
      )}
      {pantalla === 'contactos' && (
        <Contacts
          onVerDetalle={handleVerDetalle}
          onNuevo={() => setPantalla('nuevo')}
        />
      )}
      {pantalla === 'detalle' && contactoSeleccionado && (
        <Detail
          contacto={contactoSeleccionado}
          onVolver={() => setPantalla('contactos')}
          onActualizado={() => setPantalla('contactos')}
        />
      )}
    </div>
  );
}