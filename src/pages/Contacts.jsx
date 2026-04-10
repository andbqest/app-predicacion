import { useState, useEffect } from 'react';
import { db } from '../services/db';

const ESTADOS = {
  activo: { label: 'Activo', color: '#27ae60' },
  en_seguimiento: { label: 'En seguimiento', color: '#2980b9' },
  sin_respuesta: { label: 'Sin respuesta', color: '#f39c12' },
  no_interesado: { label: 'No interesado', color: '#c0392b' },
  completado: { label: 'Completado', color: '#8e44ad' },
};

export default function Contacts({ onVerDetalle, onNuevo }) {
  const [contactos, setContactos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');

  useEffect(() => {
    cargarContactos();
  }, []);

  async function cargarContactos() {
    const todos = await db.contactos.orderBy('creado_en').reverse().toArray();
    setContactos(todos);
  }

  const filtrados = contactos.filter(c => {
    const coincideBusqueda =
      c.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.sector?.toLowerCase().includes(busqueda.toLowerCase());
    const coincideEstado = filtroEstado === 'todos' || c.estado === filtroEstado;
    return coincideBusqueda && coincideEstado;
  });

  return (
    <div style={{ padding: '24px', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '500', margin: 0 }}>
          Contactos
        </h1>
        <button
          onClick={onNuevo}
          style={{
            padding: '10px 20px',
            fontSize: '14px',
            fontWeight: '500',
            backgroundColor: '#4A4AE8',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          + Nuevo
        </button>
      </div>

      <input
        type="text"
        placeholder="Buscar por nombre o sector..."
        value={busqueda}
        onChange={e => setBusqueda(e.target.value)}
        style={{
          width: '100%',
          padding: '10px 12px',
          fontSize: '15px',
          border: '1px solid #ddd',
          borderRadius: '8px',
          fontFamily: 'inherit',
          boxSizing: 'border-box',
          marginBottom: '12px'
        }}
      />

      <select
        value={filtroEstado}
        onChange={e => setFiltroEstado(e.target.value)}
        style={{
          width: '100%',
          padding: '10px 12px',
          fontSize: '15px',
          border: '1px solid #ddd',
          borderRadius: '8px',
          fontFamily: 'inherit',
          boxSizing: 'border-box',
          marginBottom: '24px'
        }}
      >
        <option value="todos">Todos los estados</option>
        {Object.entries(ESTADOS).map(([key, { label }]) => (
          <option key={key} value={key}>{label}</option>
        ))}
      </select>

      {filtrados.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#aaa', padding: '48px 0' }}>
          <p style={{ fontSize: '16px' }}>No hay contactos aún</p>
          <p style={{ fontSize: '14px' }}>Presiona "+ Nuevo" para agregar el primero</p>
        </div>
      ) : (
        filtrados.map(contacto => (
          <div
            key={contacto.id}
            onClick={() => onVerDetalle(contacto)}
            style={{
              padding: '16px',
              border: '1px solid #eee',
              borderRadius: '10px',
              marginBottom: '12px',
              cursor: 'pointer',
              backgroundColor: 'white',
              transition: 'box-shadow 0.2s'
            }}
            onMouseOver={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)'}
            onMouseOut={e => e.currentTarget.style.boxShadow = 'none'}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ fontWeight: '500', fontSize: '16px', margin: '0 0 4px' }}>
                  {contacto.nombre || 'Sin nombre'}
                </p>
                <p style={{ color: '#666', fontSize: '13px', margin: '0 0 4px' }}>
                  {contacto.sector || 'Sin sector'}
                </p>
                {contacto.proxima_accion && (
                  <p style={{ color: '#4A4AE8', fontSize: '13px', margin: 0 }}>
                    → {contacto.proxima_accion}
                  </p>
                )}
              </div>
              <span style={{
                fontSize: '12px',
                padding: '4px 10px',
                borderRadius: '20px',
                backgroundColor: ESTADOS[contacto.estado]?.color + '20',
                color: ESTADOS[contacto.estado]?.color,
                fontWeight: '500',
                whiteSpace: 'nowrap'
              }}>
                {ESTADOS[contacto.estado]?.label || contacto.estado}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}