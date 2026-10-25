# EJERCICIO 08 · My Playlists

## Descripción
Modelado y gestión de relaciones relacionales 1:N (`OneToMany` / `ManyToOne`) en PostgreSQL (`databridge_e08`) utilizando TypeORM, NestJS y React Native.

## Conceptos clave
- **`@OneToMany` y `@ManyToOne`:** Una `Playlist` se vincula con múltiples `Canciones`. La tabla `canciones` aloja la clave foránea (`playlistId`).
- **Carga de relaciones:** En `playlists.service.ts`, `relations: { canciones: true }` le indica a TypeORM que genere el `LEFT JOIN` necesario para recuperar las entidades anidadas en el JSON de respuesta.
- **Creación asociada:** Para registrar una canción hija, se busca primero la entidad padre (`Playlist`) por ID y se inyecta en la nueva instancia antes de persistir.

## Reto MODIFÍCALO: Añadir Canción a Playlist
- **DTO (`create-cancion.dto.ts`):** Recibe `titulo`, `artista` y `playlistId`.
- **Backend:** Endpoint `POST /playlists/canciones` que persiste la nueva entidad asociada.
- **Frontend:** Formulario interactivo que envía los datos y actualiza la lista mediante un nuevo fetch de la relación.