export class CreateCancionDto {
  titulo: string;
  artista: string;
  playlistId: number; // Clave foránea para asociar la canción
}