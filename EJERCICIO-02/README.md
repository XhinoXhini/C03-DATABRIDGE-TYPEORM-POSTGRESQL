# EJERCICIO 02 · CineBox

## Descripción
Consulta y representación de una colección de películas recuperadas de PostgreSQL (`databridge_e02`) mediante NestJS, TypeORM (`repository.find()`) y React Native.

## Concepto clave: `repository.find()`
- `repository.find({ order: { puntuacion: 'DESC' } })` consulta todas las filas de la tabla `peliculas` y devuelve una colección de entidades mapeadas ordenadas por puntuación.
- El backend no sabe cómo se renderizarán los datos; simplemente entrega la colección en formato JSON.

## Reto MODIFÍCALO: Campo Favorita
- **Entity:** `@Column({ default: false }) favorita: boolean;`
- **PostgreSQL:** Persistencia del valor booleano en la tabla `peliculas`.
- **Service:** Semilla inicial con `Interstellar (true)` y `Coco (false)`.
- **Frontend:** Condicional en JSX para renderizar `♥` (rojo) si es favorita o `♡` si no lo es.