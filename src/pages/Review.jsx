import { useState } from 'react';
import { db } from '../services/db';

export default function Review({ contacto, onGuardado, onCancelar }) {
  const [form, setForm] = useState(contacto);

  function handleChange(campo, valor) {
    setForm(prev => ({ ...prev, [campo]: valor }));
  }

  async function handleGuardar() {
    await db.contactos.add({
      ...form,
      creado_en: new Date().toISOString(),
      actualizado_en: new Date().toISOString()
    });
    onGuardado();
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
      <h1 style={{ fontSize: '22px', fontWeight: '500', marginBottom: '8px' }}>
        Revisa los datos extraídos
      </h1>
      <p style={{ color: '#666', fontSize: '14px', marginBottom: '24px' }}>
        La IA organizó tu mensaje. Corrige lo que necesites y guarda.
      </p>

      {campos.map(({ key, label, type }) => (
        <div key={key} style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '13px', color: '#666', display: 'block', marginBottom: '4px' }}>
            {label}
          </label>
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
        </div>
      ))}

      <div style={{ marginBottom: '16px' }}>
        <label style={{ fontSize: '13px', color: '#666', display: 'block', marginBottom: '4px' }}>
          Temas de interés
        </label>
        <input
          type="text"
          value={Array.isArray(form.temas_interes) ? form.temas_interes.join(', ') : ''}
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
      </div>

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

      <button
        onClick={handleGuardar}
        style={{
          width: '100%',
          padding: '14px',
          fontSize: '16px',
          fontWeight: '500',
          backgroundColor: '#4A4AE8',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          marginBottom: '12px'
        }}
      >
        Guardar contacto
      </button>

      <button
        onClick={onCancelar}
        style={{
          width: '100%',
          padding: '14px',
          fontSize: '16px',
          backgroundColor: 'white',
          color: '#666',
          border: '1px solid #ddd',
          borderRadius: '8px',
          cursor: 'pointer'
        }}
      >
        Cancelar
      </button>
    </div>
  );
}