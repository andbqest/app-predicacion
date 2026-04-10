import { useState } from 'react';
import { db } from '../services/db';

const ESTADOS = {
  activo: { label: 'Activo', color: '#27ae60' },
  en_seguimiento: { label: 'En seguimiento', color: '#2980b9' },
  sin_respuesta: { label: 'Sin respuesta', color: '#f39c12' },
  no_interesado: { label: 'No interesado', color: '#c0392b' },
  completado: { label: 'Completado', color: '#8e44ad' },
};

export default function Detail({ contacto, onVolver, onActualizado }) {
  const [form, setForm] = useState(contacto);
  const [editando, setEditando] = useState(false);
  const [guardando, setGuardando] = useState(false);

  function handleChange(campo, valor) {
    setForm(prev => ({ ...prev, [campo]: valor }));
  }

  async function handleGuardar() {
    setGuardando(true);
    await db.contactos.update(contacto.id, {
      ...form,
      actualizado_en: new Date().toISOString()
    });
    setEditando(false);
    setGuardando(false);
    onActualizado();
  }

  async function handleEliminar() {
    if (confirm('¿Seguro que quieres eliminar este contacto?')) {
      await db.contactos.delete(contacto.id);
      onVolver();
    }
  }

  const campos = [
    { key: 'nombre', label: 'Nombre completo' },
    { key: 'sector', label: 'Sector o zona' },
    { key: 'metodo_contacto', label: 'Método de contacto' },
    { key: 'fecha_contacto', label: 'Fecha de contacto', type: 'date' },
    { key: 'observaciones', label: 'Observaciones' },
    { key: 'proxima_accion', label: 'Próxima acción' },
    { key: 'fecha_proxima_accion', label: 'Fecha próxima acción', type: 'date' },
  ];

  return (
    <div style={{ padding: '24px', maxWidth: '600px', margin: '0 auto' }}>
      <button
        onClick={onVolver}
        style={{
          background: 'none',
          border: 'none',
          color: '#4A4AE8',
          fontSize: '15px',
          cursor: 'pointer',
          padding: '0',
          marginBottom: '20px'
        }}
      >
        ← Volver a contactos
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '500', margin: 0 }}>
          {form.nombre || 'Sin nombre'}
        </h1>
        <span style={{
          fontSize: '12px',
          padding: '4px 10px',
          borderRadius: '20px',
          backgroundColor: ESTADOS[form.estado]?.color + '20',
          color: ESTADOS[form.estado]?.color,
          fontWeight: '500'
        }}>
          {ESTADOS[form.estado]?.label}
        </span>
      </div>

      {campos.map(({ key, label, type }) => (
        <div key={key} style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '13px', color: '#666', display: 'block', marginBottom: '4px' }}>
            {label}
          </label>
          {editando ? (
            <input
              type={type || 'text'}
              value={form[key] || ''}
              onChange={e => handleChange(key, e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                fontSize: '15px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontFamily: 'inherit',
                boxSizing: 'border-box'
              }}
            />
          ) : (
            <p style={{ fontSize: '15px', margin: 0, color: form[key] ? '#222' : '#aaa' }}>
              {form[key] || 'No especificado'}
            </p>
          )}
        </div>
      ))}

      <div style={{ marginBottom: '16px' }}>
        <label style={{ fontSize: '13px', color: '#666', display: 'block', marginBottom: '4px' }}>
          Temas de interés
        </label>
        {editando ? (
          <input
            type="text"
            value={Array.isArray(form.temas_interes) ? form.temas_interes.join(', ') : (form.temas_interes || '')}
            onChange={e => handleChange('temas_interes', e.target.value.split(',').map(t => t.trim()))}
            style={{
              width: '100%',
              padding: '10px 12px',
              fontSize: '15px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontFamily: 'inherit',
              boxSizing: 'border-box'
            }}
          />
        ) : (
          <p style={{ fontSize: '15px', margin: 0, color: form.temas_interes?.length ? '#222' : '#aaa' }}>
            {Array.isArray(form.temas_interes) ? form.temas_interes.join(', ') : (form.temas_interes || 'No especificado')}
          </p>
        )}
      </div>

      {editando && (
        <div style={{ marginBottom: '24px' }}>
          <label style={{ fontSize: '13px', color: '#666', display: 'block', marginBottom: '4px' }}>
            Estado
          </label>
          <select
            value={form.estado || 'activo'}
            onChange={e => handleChange('estado', e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              fontSize: '15px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontFamily: 'inherit',
              boxSizing: 'border-box'
            }}
          >
            <option value="activo">Activo</option>
            <option value="en_seguimiento">En seguimiento</option>
            <option value="sin_respuesta">Sin respuesta</option>
            <option value="no_interesado">No interesado</option>
            <option value="completado">Completado</option>
          </select>
        </div>
      )}

      <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
        {editando ? (
          <>
            <button
              onClick={handleGuardar}
              disabled={guardando}
              style={{
                flex: 1,
                padding: '14px',
                fontSize: '15px',
                fontWeight: '500',
                backgroundColor: '#4A4AE8',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              {guardando ? 'Guardando...' : 'Guardar cambios'}
            </button>
            <button
              onClick={() => setEditando(false)}
              style={{
                flex: 1,
                padding: '14px',
                fontSize: '15px',
                backgroundColor: 'white',
                color: '#666',
                border: '1px solid #ddd',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Cancelar
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setEditando(true)}
              style={{
                flex: 1,
                padding: '14px',
                fontSize: '15px',
                fontWeight: '500',
                backgroundColor: '#4A4AE8',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Editar
            </button>
            <button
              onClick={handleEliminar}
              style={{
                flex: 1,
                padding: '14px',
                fontSize: '15px',
                backgroundColor: 'white',
                color: '#c0392b',
                border: '1px solid #c0392b',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Eliminar
            </button>
          </>
        )}
      </div>
    </div>
  );
}