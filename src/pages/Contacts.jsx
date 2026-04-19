import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { db } from "../services/supabase";
import * as XLSX from 'xlsx';
import { useState, useMemo } from 'react';
/**
 * ========================================================================
 * CONFIGURACIÓN DE IDENTIDAD VISUAL (THEME)
 * ========================================================================
 */
const DESIGN = {
  colors: {
    primary: '#3B82F6',        // Azul Royal
    primaryLight: '#EFF6FF',
    textMain: '#1E293B',       // Pizarra (Súper legible)
    textMuted: '#64748B',      // Gris azulado para IDs
    bgPage: '#F8FAFC',         // Gris Nube
    bgCard: '#FFFFFF',
    border: '#E2E8F0',         // Borde suave
    accent: '#6366F1'          // Indigo
  },
  shadows: {
    soft: '0 1px 3px rgba(0,0,0,0.1)',
    hover: '0 10px 15px -3px rgba(59, 130, 246, 0.1)' // Sombra con un toque azul
  }
};

const ESTADOS_CONFIG = {
  activo: { label: 'Activo', color: '#065F46', bg: '#D1FAE5', icon: '🌟' },
  en_seguimiento: { label: 'Revisita', color: '#1E40AF', bg: '#DBEAFE', icon: '📅' },
  sin_respuesta: { label: 'Pendiente', color: '#92400E', bg: '#FEF3C7', icon: '🏠' },
  // AQUÍ ESTABA EL ERROR (Faltaba la palabra "color:" y "label:")
  no_interesado: { label: 'No interesado', color: '#991B1B', bg: '#FEE2E2', icon: '✖️' }, 
  completado: { label: 'Estudio', color: '#3730A3', bg: '#E0E7FF', icon: '📖' },
};

/**
 * ========================================================================
 * COMPONENTE: CONTACTS (V2.0 OPTIMIZADA)
 * ========================================================================
 */
export default function Contacts({ contactos = [], onVerDetalle, onNuevo }) {
  const [busqueda, setBusqueda] = useState('');
  const [filtroActivo, setFiltroActivo] = useState('todos');

  // --- FUNCIÓN PARA EXCEL (OPTIMIZADA) ---
  const exportarExcel = () => {
    try {
      const datosParaExcel = contactos.map(c => ({
        Nombre: c.nombre || 'Sin nombre',
        Ubicación: c.lugar || 'Sin dirección',
        Estado: c.estado || 'Pendiente',
        Teléfono: c.metodo_contacto || 'N/A',
        Fecha: c.fecha || '',
        Hora: c.hora || '',
        'Próximo Paso': c.proxima_accion || '',
        Notas: c.observaciones || '',
        Temas: c.temas_interes || ''
      }));
      const ws = XLSX.utils.json_to_sheet(datosParaExcel);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Contactos");
      XLSX.writeFile(wb, `San_Fernando_Guapo_${new Date().toLocaleDateString()}.xlsx`);
    } catch (error) {
      console.error("Error al exportar Excel:", error);
    }
  };

  // --- FUNCIÓN PARA PDF (OPTIMIZADA) ---
  const exportarPDF = () => {
    try {
      const doc = new jsPDF('l', 'mm', 'a4'); // 'l' pone la hoja de LADO (horizontal) para que quepa todo
      
      doc.setFontSize(18);
      doc.setTextColor(74, 74, 232);
      doc.text("Directorio - San Fernando del Guapo", 14, 15);
      
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Fecha de reporte: ${new Date().toLocaleString()}`, 14, 22);

      // 1. MAPEAMOS TODOS LOS DATOS (Agregué los campos que faltaban)
      const tablaDatos = contactos.map(c => [
        c.nombre || '---',
        c.lugar || '---',
        c.estado || '---',
        c.metodo_contacto || '---',
        c.fecha || '---',
        c.hora || '---',
        c.proxima_accion || '---',
        c.observaciones || '---'
      ]);

      // 2. GENERAMOS LA TABLA CON MÁS COLUMNAS
      autoTable(doc, {
        startY: 30,
        head: [['Nombre', 'Ubicación', 'Estado', 'Teléfono', 'Fecha', 'Hora', 'Próximo Paso', 'Notas']],
        body: tablaDatos,
        headStyles: { fillColor: [74, 74, 232], fontSize: 9 },
        styles: { 
          fontSize: 8, 
          cellPadding: 2,
          overflow: 'linebreak' // Esto hace que si el texto es largo, salte de línea en la celda
        },
        columnStyles: {
          0: { cellWidth: 30 }, // Nombre
          1: { cellWidth: 40 }, // Ubicación
          5: { cellWidth: 20 }, // Hora (ancho corto)
          6: { cellWidth: 40 }, // Próximo paso
          7: { cellWidth: 'auto' } // Notas ocupa el resto
        },
        theme: 'grid'
      });

      doc.save(`Reporte_Completo_San_Fernando_${Date.now()}.pdf`);
      
    } catch (error) {
      console.error("Error al exportar PDF completo:", error);
      alert("No se pudo generar el reporte completo.");
    }
  };
  /**
   * FILTRADO DE ALTO RENDIMIENTO
   */
  const filtrados = useMemo(() => {
    return contactos.filter(c => {
      const term = busqueda.toLowerCase().trim();
      const coincideTexto = 
        (c.nombre?.toLowerCase().includes(term)) ||
        (c.lugar?.toLowerCase().includes(term)) ||
        (c.metodo_contacto?.toLowerCase().includes(term)) ||
        (c.observaciones?.toLowerCase().includes(term)) ||
        (c.temas_interes?.toLowerCase().includes(term));
      
      const coincideEstado = filtroActivo === 'todos' || c.estado === filtroActivo;
      return coincideTexto && coincideEstado;
    });
  }, [contactos, busqueda, filtroActivo]);

  const styles = {
    container: {
      padding: '20px',
      maxWidth: '800px',
      margin: '0 auto',
      fontFamily: '"Inter", sans-serif',
      backgroundColor: DESIGN.colors.bgPage,
      minHeight: '100vh'
    },
    header: { marginBottom: '25px' },
    titleGroup: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
    mainTitle: { fontSize: '28px', fontWeight: '850', color: DESIGN.colors.textMain, margin: 0 },
    btnAdd: {
      backgroundColor: DESIGN.colors.primary, // Azul Royal #3B82F6
      color: 'white',
      border: 'none',
      padding: '12px 24px',
      borderRadius: '16px',
      fontWeight: '700',
      cursor: 'pointer',
      // Sombra vibrante que coincide con el azul
      boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.4)', 
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '15px'
    },
    searchContainer: { position: 'relative', marginBottom: '15px' },
    searchInput: {
      width: '100%',
      padding: '16px 20px 16px 45px',
      borderRadius: '16px',
      border: `2px solid ${DESIGN.colors.border}`,
      fontSize: '16px',
      outline: 'none',
      backgroundColor: 'white',
      boxSizing: 'border-box', 
      display: 'block'
    },
    searchIcon: {
      position: 'absolute',
      left: '16px',
      top: '50%',
      transform: 'translateY(-50%)',
      fontSize: '18px',
      color: DESIGN.colors.primary, // La lupa ahora será Azul Royal
      opacity: 0.6
    },
    filterScroll: { display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px' },
    filterChip: (isActive) => ({
      padding: '8px 16px', borderRadius: '20px', border: 'none',
      backgroundColor: isActive ? DESIGN.colors.primary : 'white',
      color: isActive ? 'white' : DESIGN.colors.textMuted,
      fontWeight: '600', fontSize: '13px', cursor: 'pointer', whiteSpace: 'nowrap',
      boxShadow: DESIGN.shadows.soft
    }),
    exportBar: { display: 'flex', gap: '10px', marginBottom: '20px' },
    btnPdf: { padding: '10px 18px', backgroundColor: '#E02424', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' },
    btnExcel: { padding: '10px 18px', backgroundColor: '#1D6F42', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' },
    card: {
      backgroundColor: DESIGN.colors.bgCard,
      borderRadius: '24px',
      padding: '24px',
      marginBottom: '20px',
      border: `1px solid ${DESIGN.colors.border}`,
      cursor: 'pointer',
      position: 'relative',
      boxShadow: DESIGN.shadows.soft,
      transition: 'transform 0.2s ease'
    },
    cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' },
    badge: (estado) => ({
      padding: '6px 12px', borderRadius: '10px', fontSize: '11px', fontWeight: '800',
      textTransform: 'uppercase',
      backgroundColor: ESTADOS_CONFIG[estado]?.bg || '#EDF2F7',
      color: ESTADOS_CONFIG[estado]?.color || '#4A5568'
    }),
    gridInfo: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginTop: '15px' },
    infoItem: { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: DESIGN.colors.textMuted, fontWeight: '500' },
    importantBox: { marginTop: '20px', padding: '16px', backgroundColor: '#F8FAFC', borderRadius: '16px', borderLeft: `5px solid ${DESIGN.colors.primary}` }
  };

  return (
    <div style={styles.container}>
      
      {/* SECCIÓN CABECERA */}
      <header style={styles.header}>
        <div style={styles.titleGroup}>
          <h1 style={styles.mainTitle}>Directorio</h1>
          <button style={styles.btnAdd} onClick={onNuevo}>
            <span>＋</span> Nuevo
          </button>
        </div>

        <div style={styles.searchContainer}>
          <span style={styles.searchIcon}>🔍</span>
          <input 
            style={styles.searchInput}
            placeholder="Buscar por nombre, zona o teléfono..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <div style={styles.filterScroll}>
          <button style={styles.filterChip(filtroActivo === 'todos')} onClick={() => setFiltroActivo('todos')}>Todos</button>
          {Object.keys(ESTADOS_CONFIG).map(key => (
            <button key={key} style={styles.filterChip(filtroActivo === key)} onClick={() => setFiltroActivo(key)}>
              {ESTADOS_CONFIG[key].label}
            </button>
          ))}
        </div>
      </header>

      {/* BARRA DE EXPORTACIÓN */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '25px', marginTop: '10px' }}>
  <button 
    onClick={exportarPDF}
    style={{ 
      flex: 1, // Para que midan lo mismo
      padding: '12px', 
      backgroundColor: '#EF4444', // Rojo Coral moderno
      color: 'white', 
      border: 'none', 
      borderRadius: '14px', 
      cursor: 'pointer', 
      fontWeight: '700',
      boxShadow: '0 4px 6px -1px rgba(239, 68, 68, 0.2)' 
    }}
  >
    📄 PDF
  </button>
  <button 
    onClick={exportarExcel}
    style={{ 
      flex: 1, 
      padding: '12px', 
      backgroundColor: '#10B981', // Esmeralda de tu paleta
      color: 'white', 
      border: 'none', 
      borderRadius: '14px', 
      cursor: 'pointer', 
      fontWeight: '700',
      boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.2)' 
    }}
  >
    📊 Excel
  </button>
</div>

      {/* LISTADO DE TARJETAS */}
      <main>
        {filtrados.length > 0 ? (
          filtrados.map((c) => (
            <article 
              key={c.id || Math.random()} 
              style={styles.card}
              onClick={() => onVerDetalle(c)}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={styles.cardHeader}>
                <div>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '20px', color: DESIGN.colors.textMain }}>{c.nombre || 'Persona sin nombre'}</h3>
                  <div style={{ fontSize: '12px', color: DESIGN.colors.textMuted }}>ID: #{c.id?.toString().slice(-4)}</div>
                </div>
                <span style={styles.badge(c.estado)}>
                  {ESTADOS_CONFIG[c.estado]?.icon} {ESTADOS_CONFIG[c.estado]?.label || 'Nuevo'}
                </span>
              </div>

              <div style={styles.gridInfo}>
                <div style={styles.infoItem}><span>📍</span>{c.lugar || 'Ubicación no registrada'}</div>
                <div style={styles.infoItem}><span>📞</span>{c.metodo_contacto || 'Sin teléfono'}</div>
                <div style={styles.infoItem}><span>🕒</span>{c.hora || 'Hora no definida'}</div>
                <div style={styles.infoItem}><span>🗓️</span>{c.fecha || 'Fecha pendiente'}</div>
              </div>

              {c.proxima_accion && (
                <div style={styles.importantBox}>
                  <div style={{ fontSize: '11px', fontWeight: '800', color: DESIGN.colors.primary, textTransform: 'uppercase', marginBottom: '5px' }}>
                    Siguiente Paso
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: DESIGN.colors.textMain }}>
                    {c.proxima_accion}
                  </div>
                </div>
              )}

              {(c.observaciones || c.temas_interes) && (
                <div style={{ marginTop: '15px', display: 'flex', gap: '8px' }}>
                   <span style={{ fontSize: '12px', backgroundColor: '#EDF2F7', padding: '4px 8px', borderRadius: '6px' }}>📝 Notas</span>
                   {c.temas_interes && <span style={{ fontSize: '12px', backgroundColor: '#EBF8FF', padding: '4px 8px', borderRadius: '6px' }}>💡 Temas</span>}
                </div>
              )}
            </article>
          ))
        ) : (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ fontSize: '60px' }}>🛰️</div>
            <h3 style={{ color: DESIGN.colors.textMain }}>Sin resultados</h3>
          </div>
        )}
      </main>

      <footer style={{ height: '100px' }} />
    </div>
  );
}