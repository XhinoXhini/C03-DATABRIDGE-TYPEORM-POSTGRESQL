# EJERCICIO 09 · Event Radar

## Descripción
Consulta y filtrado dinámico de datos en PostgreSQL (`databridge_e09`) mediante parámetros de consulta (Query Params) gestionados con NestJS y TypeORM.

## Conceptos clave
- **Query Params (`@Query`):** Permiten capturar parámetros opcionales en la URL tras el carácter `?` (ej: `/eventos?ciudad=Zaragoza&categoria=Tecnología`).
- **`FindOptionsWhere<Evento>`:** Se construye de forma programática y selectiva: los filtros solo se agregan si el parámetro ha sido provisto en la petición.
- **Eficiencia:** La operación delega la condición de filtrado al motor relacional de PostgreSQL (`WHERE ciudad = ... AND categoria = ...`), transfiriendo únicamente los registros solicitados a la red.

## Reto MODIFÍCALO: Combinación Ciudad + Categoría
- **Controller:** Parámetros `@Query('ciudad')` y `@Query('categoria')`.
- **Service:** Generación dinámica del objeto `where` combinando ambos criterios.
- **Frontend:** Interfaz de chips de selección para combinar ciudad y categoría, construyendo la URL mediante `URLSearchParams`.