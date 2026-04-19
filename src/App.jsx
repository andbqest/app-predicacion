import { useState, useEffect, useCallback } from 'react';
import { db } from "./services/supabase";
import Home from './pages/Home';
import Review from './pages/Review';
import Contacts from './pages/Contacts';
import Detail from './pages/Detail';

/**
 * COMPONENTE PRINCIPAL: App
 * Optimizado para trabajo en equipo y sincronización inmediata.
 */
export default function App() {
  const [pantalla, setPantalla] = useState('contactos');
  const [listaContactos, setListaContactos] = useState([]);
  const [contactoSeleccionado, setContactoSeleccionado] = useState(null);
  const [datosParaEditar, setDatosParaEditar] = useState(null);
  const [cargando, setCargando] = useState(false);

  // --- LA LLAVE MAESTRA: Refrescar datos con optimización de memoria ---
  const cargarTodo = useCallback(async () => {
    try {
      setCargando(true);
      const datos = await db.contactos.toArray();
      
      // Ordenamos: Los más recientes primero por ID o por fecha de actualización
      const ordenados = datos.sort((a, b) => {
        const idA = a.id || 0;
        const idB = b.id || 0;
        return idB - idA;
      });

      setListaContactos([...ordenados]); 
      console.log("🔄 Base de Datos Sincronizada:", ordenados.length, "registros encontrados.");
    } catch (error) {
      console.error("❌ Error crítico al sincronizar:", error);
    } finally {
      setCargando(false);
    }
  }, []);

  // Efecto de carga inicial
  useEffect(() => { 
    cargarTodo(); 
    
    // Escuchador para cambios externos (útil si hay varias pestañas abiertas)
    const handleStorageChange = () => cargarTodo();
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [cargarTodo]);

  // --- NAVEGACIÓN Y GESTIÓN DE FLUJO ---
  
  const irAHome = () => { 
    setPantalla('nuevo'); 
    setDatosParaEditar(null); 
    setContactoSeleccionado(null);
  };

  const irAContactos = async () => {
    // 1. Efecto visual de limpieza rápida
    setListaContactos([]); 
    setPantalla('contactos'); 
    
    // 2. Pequeña pausa táctica para asegurar que la DB terminó cualquier escritura previa
    await new Promise(resolve => setTimeout(resolve, 150));
    
    // 3. Recarga forzada de la lista
    const datosActualizados = await db.contactos.toArray();
    const ordenados = datosActualizados.sort((a, b) => (b.id || 0) - (a.id || 0));
    setListaContactos([...ordenados]);
    
    console.log("✅ Interfaz refrescada y lista para usar.");
  };
  
  const iniciarEdicion = (contacto) => {
    // Preparamos los datos asegurando que no falte ningún campo
    const clonContacto = { ...contacto };
    setDatosParaEditar(clonContacto);
    setPantalla('revision');
  };

  const verDetalle = (contacto) => {
    setContactoSeleccionado(contacto);
    setPantalla('detalle');
  };

  const manejarEliminacion = async (id) => {
    const confirmacion = window.confirm("¿Estás seguro de que deseas eliminar este contacto? Esta acción no se puede deshacer.");
    if (confirmacion) {
      try {
        await db.contactos.delete(id);
        console.log(`🗑️ Registro ${id} eliminado con éxito.`);
        await irAContactos();
      } catch (err) {
        alert("Error al intentar eliminar el registro.");
      }
    }
  };

  // --- RENDERIZADO DE INTERFAZ ---
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#F0F2F5', 
      fontFamily: '"Inter", "Segoe UI", system-ui, sans-serif',
      color: '#1C1E21'
    }}>
      
      {/* BARRA SUPERIOR (NAVBAR) - Mejorada visualmente y fija */}
      <header style={{
        backgroundColor: '#FFFFFF',
        padding: '14px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        height: '60px',
        boxSizing: 'border-box'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {pantalla !== 'contactos' && (
            <button 
              onClick={irAContactos}
              aria-label="Volver atrás"
              style={{ 
                background: '#F0F2F5', 
                border: 'none', 
                borderRadius: '50%', 
                width: '38px', 
                height: '38px', 
                cursor: 'pointer', 
                fontSize: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = '#E4E6EB'}
              onMouseOut={(e) => e.currentTarget.style.background = '#F0F2F5'}
            >
              ←
            </button>
          )}
          <span style={{ 
            fontWeight: '800', 
            color: '#4A4AE8', 
            fontSize: '19px',
            letterSpacing: '-0.5px'
          }}>
             San Fernando del Guapo
          </span>
        </div>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={irAContactos}
            style={{
              padding: '8px 18px',
              borderRadius: '12px',
              border: 'none',
              fontWeight: '700',
              fontSize: '14px',
              backgroundColor: pantalla === 'contactos' ? '#4A4AE8' : 'transparent',
              color: pantalla === 'contactos' ? 'white' : '#65676B',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Lista
          </button>
          <button 
            onClick={irAHome}
            style={{
              padding: '8px 18px',
              borderRadius: '12px',
              border: 'none',
              fontWeight: '700',
              fontSize: '14px',
              backgroundColor: pantalla === 'nuevo' ? '#4A4AE8' : 'transparent',
              color: pantalla === 'nuevo' ? 'white' : '#65676B',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            + Nuevo
          </button>
        </div>
      </header>

      {/* CONTENIDO DINÁMICO CON CONTENEDOR DE SEGURIDAD */}
      <main style={{ 
        padding: '16px', 
        maxWidth: '650px', 
        margin: '0 auto',
        minHeight: 'calc(100vh - 60px)'
      }}>
        
        {cargando && pantalla === 'contactos' && listaContactos.length === 0 && (
          <div style={{ textAlign: 'center', marginTop: '50px', color: '#65676B' }}>
            Cargando registros...
          </div>
        )}

        {pantalla === 'contactos' && (
          <Contacts 
            contactos={listaContactos} 
            onVerDetalle={verDetalle} 
            onNuevo={irAHome}
          />
        )}

        {pantalla === 'nuevo' && (
          <Home onContactoParsed={(datos) => { 
            setDatosParaEditar(datos); 
            setPantalla('revision'); 
          }} />
        )}

        {pantalla === 'revision' && (
          <Review 
            contacto={datosParaEditar} 
            onFinalizar={irAContactos} 
          />
        )}

        {pantalla === 'detalle' && contactoSeleccionado && (
          <Detail 
            contacto={contactoSeleccionado}
            onRegresar={irAContactos}
            onEditar={() => iniciarEdicion(contactoSeleccionado)}
            onEliminar={(id) => manejarEliminacion(id)}
          />
        )}
      </main>

      {/* FOOTER DE ESTADO (Invisible pero funcional para asegurar altura) */}
      <footer style={{ height: '40px', opacity: 0 }}>
        Espaciador técnico de final de página
      </footer>
    </div>
  );
}