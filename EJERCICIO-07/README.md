# EJERCICIO 07 · Sneaker Vault

## Descripción
Implementación de un ciclo CRUD completo (Create, Read, Update, Delete) sobre PostgreSQL (`databridge_e07`) mediante NestJS, TypeORM y React Native con sincronización de interfaz tras cada mutación.

## Conceptos clave
- **Operaciones CRUD:**
  - `POST /sneakers`: Creación (`create` + `save`).
  - `GET /sneakers`: Lectura de colección (`find`).
  - `GET /sneakers/:id`: Lectura individual (`findOneBy`).
  - `PATCH /sneakers/:id`: Actualización parcial (`merge` + `save`).
  - `DELETE /sneakers/:id`: Eliminación (`remove`).
- **Resincronización UI:** Tras cada acción de modificación (POST/PATCH/DELETE) la app invoca `cargar()` para reflejar el estado real persistido en PostgreSQL.

## Reto MODIFÍCALO: Regla visual de Stock
- **Entity & DTOs:** Columna `@Column({ default: 0 }) stock: number;` en `Sneaker`, `CreateSneakerDto` y `UpdateSneakerDto`.
- **Regla de presentación:** La base de datos almacena el valor numérico (`0`, `4`, etc.). React Native deriva la presentación condicionalmente: si `stock === 0` renderiza el badge `AGOTADO`, en caso contrario muestra `Stock X`.