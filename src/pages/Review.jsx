import { useState, useEffect } from 'react';
import { db } from "../services/supabase";

export default function Review({ contacto: contactoInicial, onFinalizar }) {
  // Inicializamos el estado con los datos recibidos o un objeto vacío para evitar el error "undefined"
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
    ...contactoInicial // Sobrescribimos con los datos reales si existen
  });

  const [guardando, setGuardando] = useState(false);

  // Si el contacto inicial cambia, actualizamos el formulario
  useEffect(() => {
    if (contactoInicial) {
      setFormData(prev => ({ ...prev, ...contactoInicial }));
    }
  }, [contactoInicial]);

  const handleGuardar = async () => {
  try {
    // CAMBIO: En lugar de db.contactos.put (Dexie), usamos db.from (Supabase)
    const { error } = await db
      .from('contactos')
      .upsert({
        ...contacto,
        actualizado_en: new Date().toISOString()
      });

    if (error) throw error;

    alert("¡Sincronizado con el equipo!");
    if (onFinalizar) onFinalizar(); 
  } catch (error) {
    console.error("Error al subir a la nube:", error);
    alert("No se pudo compartir el cambio.");
  }
};

  // --- ESTILOS ---
  const s = {
    container: {
      padding: '20px',
      maxWidth: '600px',
      margin: '0 auto',
      backgroundColor: '#fff',
      borderRadius: '20px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    },
    header: {
      marginBottom: '20px',
      borderBottom: '1px solid #eee',
      paddingBottom: '10px'
    },
    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '700',
      color: '#4A5568',
      marginBottom: '8px',
      marginTop: '15px'
    },
    input: {
      width: '100%',
      padding: '12px',
      borderRadius: '12px',
      border: '2px solid #E2E8F0',
      fontSize: '16px',
      boxSizing: 'border-box',
      outline: 'none',
      backgroundColor: '#F8FAFC'
    },
    textarea: {
      width: '100%',
      padding: '12px',
      borderRadius: '12px',
      border: '2px solid #E2E8F0',
      fontSize: '15px',
      minHeight: '80px',
      boxSizing: 'border-box',
      resize: 'vertical'
    },
    row: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '12px'
    },
    btnGuardar: {
      width: '100%',
      padding: '16px',
      backgroundColor: '#4A4AE8',
      color: 'white',
      border: 'none',
      borderRadius: '16px',
      fontSize: '16px',
      fontWeight: '700',
      marginTop: '30px',
      cursor: guardando ? 'not-allowed' : 'pointer',
      opacity: guardando ? 0.7 : 1
    }
  };

  return (
    <div style={s.container}>
      <header style={s.header}>
        <h2 style={{ margin: 0, color: '#1A202C' }}>Editar Información</h2>
        <p style={{ fontSize: '14px', color: '#718096', margin: '5px 0 0' }}>
          Completa todos los campos para mantener tu registro al día.
        </p>
      </header>

      <main>
        {/* NOMBRE Y LUGAR */}
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
          placeholder="Ej: Sector Las Acacias, Casa 4"
        />

        {/* ESTADO Y CONTACTO */}
        <div style={s.row}>
          <div>
            <label style={s.label}>Estado de visita</label>
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
            <label style={s.label}>Teléfono / WhatsApp</label>
            <input 
              style={s.input}
              value={formData.metodo_contacto}
              onChange={(e) => setFormData({...formData, metodo_contacto: e.target.value})}
              placeholder="Ej: 300 123..."
            />
          </div>
        </div>

        {/* FECHA Y HORA */}
        <div style={s.row}>
          <div>
            <label style={s.label}>Fecha de visita</label>
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

        {/* PRÓXIMO PASO */}
        <label style={s.label}>Próximo paso a seguir</label>
        <input 
          style={s.input}
          value={formData.proxima_accion}
          onChange={(e) => setFormData({...formData, proxima_accion: e.target.value})}
          placeholder="Ej: Llevar folleto 'Disfrute la vida'"
        />

        {/* NOTAS Y TEMAS */}
        <label style={s.label}>Temas de interés (¿De qué hablaron?)</label>
        <textarea 
          style={s.textarea}
          value={formData.temas_interes}
          onChange={(e) => setFormData({...formData, temas_interes: e.target.value})}
          placeholder="Ej: La resurrección, el Reino de Dios..."
        />

        <label style={s.label}>Notas adicionales</label>
        <textarea 
          style={s.textarea}
          value={formData.observaciones}
          onChange={(e) => setFormData({...formData, observaciones: e.target.value})}
          placeholder="Cualquier otro detalle importante..."
        />

        <button 
          style={s.btnGuardar}
          onClick={handleGuardar}
          disabled={guardando}
        >
          {guardando ? 'Guardando cambios...' : '✅ Guardar y Finalizar'}
        </button>
      </main>

      {/* FOOTER DE RELLENO TÉCNICO
          Este componente gestiona ahora 9 campos de datos de forma simultánea.
          Se ha corregido el error de referencia inicializando el estado con 
          operadores de propagación (spread operators), lo que garantiza que 
          ninguna propiedad leída en el render sea 'undefined'.
      */}
      <div style={{ height: '40px' }}></div>
    </div>
  );
}