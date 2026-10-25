# EJERCICIO 01 · Game Vault

## Descripción
Aplicación Full Stack que conecta React Native con NestJS, persistiendo y recuperando datos en PostgreSQL mediante TypeORM.

## Recorrido del dato
1. **Frontend (React Native):** Solicita la colección mediante `fetch('http://localhost:3000/videojuegos')`.
2. **Controller (`VideojuegosController`):** Recibe la petición HTTP `GET /videojuegos` y delega en el Service.
3. **Service (`VideojuegosService`):** Llama a `repository.find({ order: { puntuacion: 'DESC' } })`.
4. **Repository & TypeORM:** Consulta la tabla `videojuegos` en la base de datos `databridge_e01`.
5. **PostgreSQL:** Devuelve los registros a TypeORM, que los mapea a instancias de `Videojuego`.
6. **Respuesta:** NestJS serializa los datos a JSON y React Native los renderiza en la `FlatList`.

## Reto MODIFÍCALO: Campo Género
Se implementó el campo `genero` de extremo a extremo:
- **Entity (`videojuego.entity.ts`):** Añadido `@Column() genero: string`.
- **Persistencia (PostgreSQL):** Columna sincronizada automáticamente mediante TypeORM.
- **Service (`videojuegos.service.ts`):** Datos iniciales (`onModuleInit`) actualizados con los géneros correspondientes.
- **Frontend (`App.tsx`):** Tipo `Videojuego` actualizado y renderizado en cada tarjeta (`item.genero · item.plataforma`).