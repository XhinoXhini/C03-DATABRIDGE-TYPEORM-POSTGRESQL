# EJERCICIO 10 · Wander (Full Stack Challenge)

## Descripción
Integración autónoma de un CRUD persistente completo sobre PostgreSQL (`databridge_e10`) conectando React Native y NestJS mediante TypeORM.

## Recorrido del dato Full Stack
1. **Frontend:** React Native realiza peticiones HTTP (`GET`, `POST`, `PATCH`, `DELETE`) hacia la API.
2. **HTTP:** La solicitud viaja por red encapsulando parámetros de ruta, cuerpo JSON o cabeceras.
3. **Controller (`DestinosController`):** Enruta la llamada y valida la entrada con DTOs o pipes.
4. **Service (`DestinosService`):** Aplica la lógica de negocio coordinando con el repositorio.
5. **Repository & TypeORM:** Mapea las entidades TypeScript y genera las sentencias SQL correspondientes.
6. **PostgreSQL:** Persiste de forma transaccional y definitiva los registros en la base de datos `databridge_e10`.

## Mejora Propia Implementada
Se añadieron dos campos persistentes integrados de extremo a extremo:
- **`visitado: boolean`:** Permite alternar mediante `PATCH /destinos/:id` el estado de visita de un destino, reflejándose visualmente con `✓ Visitado` en la tarjeta.
- **`prioridad: string`:** Clasifica la importancia del destino (`Alta`, `Media`, `Baja`) desde su creación (`POST /destinos`), almacenándose en base de datos y formateándose en un badge distintivo.