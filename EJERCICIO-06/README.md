# EJERCICIO 06 · My Library

## Descripción
Eliminación (`DELETE /libros/:id`) y actualización parcial (`PATCH /libros/:id/leido`) de recursos en PostgreSQL (`databridge_e06`) con sincronización explícita del estado en React Native.

## Conceptos clave
- **`repository.remove(entity)`:** Elimina la entidad de la base de datos tras verificar previamente su existencia con `findOneBy`.
- **Sincronización de memoria:** PostgreSQL y el estado `useState` de React Native son memorias independientes. Borrar una fila en la base de datos exige filtrar el array local (`setLibros(actuales => actuales.filter(...))`) para mantener la interfaz actualizada sin necesidad de recargar la aplicación.

## Reto MODIFÍCALO: Marcar como leído
- **Entity:** Campo `@Column({ default: false }) leido: boolean;`.
- **Backend:** Endpoint `PATCH /libros/:id/leido` que modifica la columna `leido` a `true` y la persiste.
- **Frontend:** Botón interactivo que ejecuta la llamada PATCH y actualiza la tarjeta a "Leído ✓".