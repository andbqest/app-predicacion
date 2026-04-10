import Dexie from 'dexie';

export const db = new Dexie('PredicacionDB');

db.version(1).stores({
  contactos: '++id, nombre, sector, estado, fecha_contacto, fecha_proxima_accion, creado_en, actualizado_en'
});