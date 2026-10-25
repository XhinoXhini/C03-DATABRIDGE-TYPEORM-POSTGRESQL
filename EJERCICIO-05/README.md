# EJERCICIO 05 · Travel Book

## Descripción
Actualización parcial de registros en PostgreSQL (`databridge_e05`) utilizando peticiones HTTP `PATCH /viajes/:id` gestionadas con NestJS, TypeORM y React Native.

## Conceptos clave
- **PATCH:** Método HTTP diseñado para modificar solo los campos enviados en el cuerpo, sin requerir la sobreescritura de la entidad completa.
- **DTO con propiedades opcionales (`?`):** `UpdateViajeDto` permite que el cliente decida qué atributos actualizar de forma flexible.
- **`repository.merge(viaje, dto)`:** Fusiona sobre la entidad existente únicamente las propiedades que vienen en el DTO.
- **`repository.save(viaje)`:** Persiste el resultado en la base de datos PostgreSQL.

## Reto MODIFÍCALO: Edición de Fecha
- **DTO (`update-viaje.dto.ts`):** Añadido `fecha?: string;`.
- **Frontend (`App.tsx`):** Campo de entrada para fecha, integrado en el formulario y sincronizado en la tarjeta del viaje.
- **Persistencia comprobada:** Los cambios de fecha y estado se conservan tras reiniciar el servidor NestJS.