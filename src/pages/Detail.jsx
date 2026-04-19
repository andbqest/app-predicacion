import { useState, useEffect } from 'react';
import { db } from "../services/supabase";


const ESTADOS = {
  activo: { label: 'Activo', color: '#27ae60', bg: '#eafaf1', icon: '🟢' },
  en_seguimiento: { label: 'En seguimiento', color: '#2980b9', bg: '#ebf5fb', icon: '🔵' },
  sin_respuesta: { label: 'Sin respuesta', color: '#f39c12', bg: '#fef5e7', icon: '🟡' },
  no_interesado: { label: 'No interesado', color: '#c0392b', bg: '#fdecea', icon: '🔴' },
  completado: { label: 'Completado', color: '#8e44ad', bg: '#f4ecf7', icon: '🟣' },
};

/**
 * COMPONENTE PRINCIPAL: DETAIL
 * Props:
 * - contacto: Objeto con toda la información del contacto.
 * - onRegresar: Función para volver a la lista de contactos.
 * - onEditar: Función para abrir el formulario de edición.
 * - onEliminar: Función para borrar el contacto de la base de datos.
 */
export default function Detail({ 
  contacto, 
  onRegresar, 
  onEditar, 
  onEliminar 
}) {
  const [cargado, setCargado] = useState(false);

  // Animación de entrada: la ficha sube suavemente al cargar
  useEffect(() => {
    if (contacto) {
      const timer = setTimeout(() => setCargado(true), 50);
      return () => clearTimeout(timer);
    }
  }, [contacto]);

  // Si no hay contacto, no mostramos nada para evitar errores
  if (!contacto) return null;

  // --- OBJETOS DE ESTILO (CSS-in-JS) ---
  
  const styles = {
    container: {
      padding: '24px',
      maxWidth: '750px',
      margin: '0 auto',
      fontFamily: '"Inter", sans-serif',
      opacity: cargado ? 1 : 0,
      transform: cargado ? 'translateY(0)' : 'translateY(30px)',
      transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
    },
    headerNav: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '30px',
    },
    btnBack: {
      border: 'none',
      background: '#ffffff',
      padding: '12px 20px',
      borderRadius: '16px',
      color: '#4A4AE8',
      cursor: 'pointer',
      fontSize: '15px',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
      transition: 'transform 0.2s',
    },
    btnEdit: {
      border: 'none',
      background: 'linear-gradient(135deg, #4A4AE8 0%, #3535C2 100%)',
      color: 'white',
      padding: '12px 28px',
      borderRadius: '16px',
      fontSize: '15px',
      fontWeight: '600',
      cursor: 'pointer',
      boxShadow: '0 6px 16px rgba(74, 74, 232, 0.25)',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      transition: 'all 0.2s',
    },
    card: {
      backgroundColor: DESIGN.colors.bgCard,
      borderRadius: '24px',
      padding: '24px',
      marginBottom: '20px',
      border: `1px solid ${DESIGN.colors.border}`,
      cursor: 'pointer',
      position: 'relative',
      boxShadow: DESIGN.shadows.soft,
      // TRANSICIÓN SUAVE
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
    },
    avatar: {
      width: '100px',
      height: '100px',
      borderRadius: '35px',
      backgroundColor: '#f0f4ff',
      color: '#4A4AE8',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '40px',
      fontWeight: 'bold',
      margin: '0 auto 20px',
      boxShadow: '0 8px 20px rgba(74, 74, 232, 0.1)',
    },
    statusBadge: {
      display: 'inline-block',
      padding: '8px 20px',
      borderRadius: '25px',
      fontSize: '14px',
      fontWeight: '700',
      backgroundColor: ESTADOS[contacto.estado]?.bg || '#f7fafc',
      color: ESTADOS[contacto.estado]?.color || '#4a5568',
      marginBottom: '30px',
    },
    divider: {
      height: '1px',
      backgroundColor: '#f0f0f0',
      margin: '30px 0',
      border: 'none',
    },
    section: {
      marginBottom: '35px',
    },
    sectionLabel: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      fontSize: '13px',
      fontWeight: '800',
      color: '#cbd5e0',
      textTransform: 'uppercase',
      letterSpacing: '1.5px',
      marginBottom: '20px',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: '24px',
    },
    infoBlock: {
      backgroundColor: '#fcfcfc',
      padding: '16px',
      borderRadius: '16px',
      border: '1px solid #f7f7f7',
    },
    dataLabel: {
      fontSize: '12px',
      color: '#a0aec0',
      fontWeight: '600',
      marginBottom: '6px',
      display: 'block',
    },
    dataValue: {
      fontSize: '17px',
      color: '#2d3748',
      fontWeight: '600',
    },
    notesArea: {
      backgroundColor: '#f8faff',
      padding: '24px',
      borderRadius: '20px',
      border: '1px solid #eef2ff',
      fontSize: '16px',
      lineHeight: '1.7',
      color: '#4a5568',
      whiteSpace: 'pre-wrap',
    },
    footerAction: {
      marginTop: '50px',
      paddingTop: '30px',
      borderTop: '1px dashed #e2e8f0',
      textAlign: 'center',
    },
    btnDelete: {
      background: 'none',
      border: 'none',
      color: '#e53e3e',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      textDecoration: 'none',
      padding: '12px 24px',
      borderRadius: '12px',
      transition: 'background 0.2s',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
    }
  };

  return (
    <div style={styles.container}>
      
      {/* --- CABECERA DE NAVEGACIÓN --- */}
      <div style={styles.headerNav}>
        <button 
          onClick={onRegresar} 
          style={styles.btnBack}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(-5px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
        >
          <span>←</span> Lista de Contactos
        </button>

        <button 
          onClick={() => onEditar(contacto)} 
          style={styles.btnEdit}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
        >
          <span>📝</span> Editar Perfil
        </button>
      </div>

      {/* --- TARJETA PRINCIPAL --- */}
      <div style={styles.card}>
        
        {/* IDENTIDAD VISUAL */}
        <div style={{ textAlign: 'center' }}>
          <div style={styles.avatar}>
            {contacto.nombre ? contacto.nombre[0].toUpperCase() : '?'}
          </div>
          <h1 style={{ fontSize: '32px', color: '#1a202c', margin: '0 0 8px 0', letterSpacing: '-0.5px' }}>
            {contacto.nombre || 'Nombre no disponible'}
          </h1>
          <div style={styles.statusBadge}>
            {ESTADOS[contacto.estado]?.icon} {ESTADOS[contacto.estado]?.label || 'Sin estado'}
          </div>
        </div>

        {/* SECCIÓN: INFORMACIÓN DE CONTACTO */}
        <div style={styles.section}>
          <div style={styles.sectionLabel}>
            <div style={{ width: '24px', height: '2px', backgroundColor: '#4A4AE8' }}></div>
            Datos de Localización
          </div>
          <div style={styles.grid}>
            <div style={styles.infoBlock}>
              <span style={styles.dataLabel}>📍 Sector / Zona</span>
              <div style={styles.dataValue}>{contacto.lugar || 'No especificado'}</div>
            </div>
            <div style={styles.infoBlock}>
              <span style={styles.dataLabel}>📞 Método Preferido</span>
              <div style={styles.dataValue}>{contacto.metodo_contacto || 'No especificado'}</div>
            </div>
            <div style={styles.infoBlock}>
              <span style={styles.dataLabel}>📅 Proxima visita</span>
              <div style={styles.dataValue}>{contacto.fecha || 'Fecha no registrada'}</div>
            </div>
            <div style={styles.infoBlock}>
              <span style={styles.dataLabel}>⏰ Hora habitual</span>
              <div style={styles.dataValue}>{contacto.hora || 'No registrada'}</div>
            </div>
          </div>
        </div>

        {/* SECCIÓN: OBSERVACIONES */}
        <div style={styles.section}>
          <div style={styles.sectionLabel}>
            <div style={{ width: '24px', height: '2px', backgroundColor: '#4A4AE8' }}></div>
            Notas y Observaciones
          </div>
          <div style={styles.notesArea}>
            {contacto.observaciones || 'No se han añadido comentarios adicionales para este contacto.'}
          </div>
        </div>

        {/* SECCIÓN: PRÓXIMA ACCIÓN (HOJA DE RUTA) */}
        {contacto.proxima_accion && (
          <div style={styles.section}>
            <div style={styles.sectionLabel}>
              <div style={{ width: '24px', height: '2px', backgroundColor: '#4A4AE8' }}></div>
              Próximo paso
            </div>
            <div style={{ ...styles.infoBlock, borderLeft: '5px solid #4A4AE8', backgroundColor: '#f0f0ff' }}>
              <div style={{ fontSize: '18px', fontWeight: '700', color: '#4A4AE8', marginBottom: '8px' }}>
                {contacto.proxima_accion}
              </div>
              {contacto.fecha_proxima_accion && (
                <div style={{ fontSize: '14px', color: '#718096' }}>
                  📅 Programado para: <strong>{contacto.fecha_proxima_accion}</strong>
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- ACCIÓN PELIGROSA: ELIMINAR --- */}
        <div style={styles.footerAction}>
          <button 
            style={styles.btnDelete}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fff5f5'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            onClick={() => {
              if (window.confirm(`¿Estás completamente seguro de eliminar a "${contacto.nombre}"? Esta acción no se puede deshacer.`)) {
                onEliminar(contacto.id);
              }
            }}
          >
            🗑️ Eliminar este contacto definitivamente
          </button>
          <div style={{ fontSize: '11px', color: '#cbd5e0', marginTop: '15px' }}>
            ID del sistema: {contacto.id} • Creado el {contacto.creado_en ? new Date(contacto.creado_en).toLocaleDateString() : 'Desconocido'}
          </div>
        </div>

      </div>
    </div>
  );
}