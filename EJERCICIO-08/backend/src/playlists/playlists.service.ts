import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cancion } from './cancion.entity';
import { CreateCancionDto } from './create-cancion.dto';
import { Playlist } from './playlist.entity';

@Injectable()
export class PlaylistsService implements OnModuleInit {
  constructor(
    @InjectRepository(Playlist)
    private readonly playlists: Repository<Playlist>,
    @InjectRepository(Cancion)
    private readonly canciones: Repository<Cancion>,
  ) {}

  async onModuleInit(): Promise<void> {
    if ((await this.playlists.count()) === 0) {
      const playlist = await this.playlists.save(
        this.playlists.create({ nombre: 'Entrenamiento' }),
      );
      await this.canciones.save(
        this.canciones.create({
          titulo: 'Run Boy Run',
          artista: 'Woodkid',
          playlist,
        }),
      );
    }
  }

  async findOne(id: number): Promise<Playlist> {
    const playlist = await this.playlists.findOne({
      where: { id },
      relations: { canciones: true },
    });
    if (!playlist) throw new NotFoundException('Playlist no encontrada');
    return playlist;
  }

  // Reto MODIFÍCALO: asociar una nueva canción a una playlist existente
  async addCancion(dto: CreateCancionDto): Promise<Cancion> {
    const playlist = await this.playlists.findOneBy({ id: dto.playlistId });
    if (!playlist) throw new NotFoundException('Playlist no encontrada');

    const cancion = this.canciones.create({
      titulo: dto.titulo,
      artista: dto.artista,
      playlist,
    });

    return this.canciones.save(cancion);
  }
}