# EJERCICIO 03 · Pet Profile

## Descripción
Búsqueda y visualización de un registro individual en PostgreSQL (`databridge_e03`) a través de un Path Param (`:id`) en NestJS y renderizado en React Native.

## Conceptos clave
- **Path Param (`:id`):** Permite recibir identificadores dinámicos en la ruta HTTP.
- **`ParseIntPipe`:** Valida y transforma el parámetro de texto de la URL en un entero tipado.
- **`repository.findOneBy({ id })`:** Consulta una fila única por clave primaria. Si no existe, se lanza `NotFoundException` para retornar un código de estado 404.

## Reto MODIFÍCALO: Nivel de Energía
- **Entity:** Columna `@Column({ default: 'Media' }) nivelEnergia: string;`.
- **Service:** Inicialización de Nala con `nivelEnergia: 'Alta'`.
- **Frontend:** Consumo y despliegue del badge de energía en la tarjeta de la mascota.