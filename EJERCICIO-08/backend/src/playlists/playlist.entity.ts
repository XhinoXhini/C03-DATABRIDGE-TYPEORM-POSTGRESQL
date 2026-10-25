import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Cancion } from './cancion.entity';

@Entity('playlists')
export class Playlist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  // Una Playlist contiene muchas Canciones
  @OneToMany(() => Cancion, (cancion) => cancion.playlist)
  canciones: Cancion[];
}