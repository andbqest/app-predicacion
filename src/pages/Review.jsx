if (typeof window !== 'undefined') {
  window.DESIGN = {
    colors: {
      primary: '#4A4AE8',
      text: '#1A202C',
      gray: '#718096',
      border: '#E2E8F0',
      background: '#F8FAFC'
    }
  };
}

import { useState, useEffect } from 'react';
import { db } from "../services/supabase";

const DESIGN = {
  colors: {
    primary: '#4A4AE8',
    secondary: '#E2E8F0',
    text: '#1A202C',
    textLight: '#718096',
    background: '#F8FAFC',
    border: '#E2E8F0',
    white: '#FFFFFF',
    error: '#d93025'
  },
  spacing: {
    padding: '20px',
    borderRadius: '16px'
  }
};

export default function Review({ contacto: contactoInicial, onFinalizar }) {
  // 1. ESTADO INICIAL COMPLETO
  // Garantizamos que todos los campos existan desde el segundo 1
  const [formData, setFormData] = useState({
    nombre: '',
    lugar: '',
    estado: 'activo',
    metodo_contacto: '',
    fecha: new Date().toISOString().split('T')[0],
    hora: '',
    proxima_accion: '',
    observaciones: '',
    temas_interes: '',
    ...contactoInicial 
  });
  
  const [guardando, setGuardando] = useState(false);

  // Sincronización si los props cambian
  useEffect(() => {
    if (contactoInicial) {
      setFormData(prev => ({ ...prev, ...contactoInicial }));
    }
  }, [contactoInicial]);

  // 2. FUNCIÓN DE GUARDADO BLINDADA
  const handleGuardar = async () => {
    // Verificación de seguridad: si no hay nombre, no guardamos
    if (!formData.nombre.trim()) {
      alert("Por favor, ingresa al menos el nombre.");
      return;
    }

    setGuardando(true);
    
    try {
      // Creamos el paquete de datos asegurándonos de que coincida con tu tabla de Supabase
      const registroFinal = {
        nombre: formData.nombre,
        lugar: formData.lugar,
        estado: formData.estado,
        metodo_contacto: formData.metodo_contacto,
        fecha: formData.fecha,
        hora: formData.hora,
        proxima_accion: formData.proxima_accion,
        observaciones: formData.observaciones,
        temas_interes: formData.temas_interes,
        actualizado_en: new Date().toISOString()
      };

      // Si viene de una edición, incluimos el ID para que no cree uno nuevo
      if (formData.id) registroFinal.id = formData.id;

      const { error: errorSupa } = await db
        .from('contactos')
        .upsert(registroFinal);

      if (errorSupa) throw errorSupa;

      alert("¡Sincronizado con el equipo! 🚀");
      if (onFinalizar) onFinalizar(); 

    } catch (err) {
      console.error("Error al subir a la nube:", err);
      alert("Error técnico: " + (err.message || "No se pudo conectar con Supabase"));
    } finally {
      setGuardando(false);
    }
  };

  // 3. ESTILOS COMPLETOS (Tu diseño original)
  const s = {
    container: {
      padding: '20px',
      maxWidth: '600px',
      margin: '0 auto',
      backgroundColor: '#fff',
      borderRadius: '20px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    },
    header: {
      marginBottom: '20px',
      borderBottom: '1px solid #f0f0f0',
      paddingBottom: '15px'
    },
    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '700',
      color: '#4A5568',
      marginBottom: '6px',
      marginTop: '16px'
    },
    input: {
      width: '100%',
      padding: '14px',
      borderRadius: '12px',
      border: '2px solid #E2E8F0',
      fontSize: '16px',
      boxSizing: 'border-box',
      outline: 'none',
      backgroundColor: '#F8FAFC',
      transition: 'border-color 0.2s'
    },
    textarea: {
      width: '100%',
      padding: '14px',
      borderRadius: '12px',
      border: '2px solid #E2E8F0',
      fontSize: '15px',
      minHeight: '100px',
      boxSizing: 'border-box',
      resize: 'vertical',
      backgroundColor: '#F8FAFC',
      outline: 'none'
    },
    row: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '15px'
    },
    btnGuardar: {
      width: '100%',
      padding: '18px',
      backgroundColor: guardando ? '#CBD5E0' : '#4A4AE8',
      color: 'white',
      border: 'none',
      borderRadius: '16px',
      fontSize: '16px',
      fontWeight: '700',
      marginTop: '32px',
      cursor: guardando ? 'not-allowed' : 'pointer',
      boxShadow: '0 4px 6px rgba(74, 74, 232, 0.2)',
      transition: 'all 0.2s'
    }
  };

  return (
    <div style={s.container}>
      <header style={s.header}>
        <h2 style={{ margin: 0, color: '#1A202C', fontSize: '24px' }}>Revisar Información</h2>
        <p style={{ fontSize: '14px', color: '#718096', margin: '8px 0 0' }}>
          La IA ha extraído estos datos. Por favor, asegúrate de que todo sea correcto.
        </p>
      </header>

      <main>
        <label style={s.label}>Nombre completo</label>
        <input 
          style={s.input}
          value={formData.nombre}
          onChange={(e) => setFormData({...formData, nombre: e.target.value})}
          placeholder="Ej: Esther Baquero"
        />

        <label style={s.label}>Ubicación / Dirección</label>
        <input 
          style={s.input}
          value={formData.lugar}
          onChange={(e) => setFormData({...formData, lugar: e.target.value})}
          placeholder="Ej: Sector Las Acacias"
        />

        <div style={s.row}>
          <div>
            <label style={s.label}>Estado</label>
            <select 
              style={s.input}
              value={formData.estado}
              onChange={(e) => setFormData({...formData, estado: e.target.value})}
            >
              <option value="activo">Activo</option>
              <option value="en_seguimiento">Revisita</option>
              <option value="sin_respuesta">Pendiente</option>
              <option value="no_interesado">No interesado</option>
              <option value="completado">Estudio</option>
            </select>
          </div>
          <div>
            <label style={s.label}>Teléfono</label>
            <input 
              style={s.input}
              value={formData.metodo_contacto}
              onChange={(e) => setFormData({...formData, metodo_contacto: e.target.value})}
              placeholder="Ej: 300..."
            />
          </div>
        </div>

        <div style={s.row}>
          <div>
            <label style={s.label}>Fecha</label>
            <input 
              type="date"
              style={s.input}
              value={formData.fecha}
              onChange={(e) => setFormData({...formData, fecha: e.target.value})}
            />
          </div>
          <div>
            <label style={s.label}>Hora</label>
            <input 
              type="time"
              style={s.input}
              value={formData.hora}
              onChange={(e) => setFormData({...formData, hora: e.target.value})}
            />
          </div>
        </div>

        <label style={s.label}>Próximo paso a seguir</label>
        <input 
          style={s.input}
          value={formData.proxima_accion}
          onChange={(e) => setFormData({...formData, proxima_accion: e.target.value})}
          placeholder="¿Qué sigue?"
        />

        <label style={s.label}>Temas de interés</label>
        <textarea 
          style={s.textarea}
          value={formData.temas_interes}
          onChange={(e) => setFormData({...formData, temas_interes: e.target.value})}
        />

        <label style={s.label}>Notas adicionales</label>
        <textarea 
          style={s.textarea}
          value={formData.observaciones}
          onChange={(e) => setFormData({...formData, observaciones: e.target.value})}
        />

        <button 
          style={s.btnGuardar}
          onClick={handleGuardar}
          disabled={guardando}
        >
          {guardando ? 'Sincronizando con la nube...' : '✅ Guardar y Finalizar'}
        </button>
      </main>

      <div style={{ height: '40px' }}></div>
    </div>
  );
}