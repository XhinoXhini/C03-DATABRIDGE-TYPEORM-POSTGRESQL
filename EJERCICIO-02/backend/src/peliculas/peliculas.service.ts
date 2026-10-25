import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pelicula } from './pelicula.entity';

@Injectable()
export class PeliculasService implements OnModuleInit {
  constructor(
    @InjectRepository(Pelicula)
    private readonly repository: Repository<Pelicula>,
  ) {}

  async onModuleInit(): Promise<void> {
    const total = await this.repository.count();
    if (total === 0) {
      await this.repository.save([
        this.repository.create({
          titulo: 'Interstellar',
          genero: 'Ciencia ficción',
          anio: 2014,
          puntuacion: 9.2,
          favorita: true, // Marcada como favorita (♥)
        }),
        this.repository.create({
          titulo: 'Coco',
          genero: 'Animación',
          anio: 2017,
          puntuacion: 8.8,
          favorita: false, // No favorita (♡)
        }),
      ]);
    }
  }

  // repository.find() recupera la colección ordenada por puntuación descendente
  findAll(): Promise<Pelicula[]> {
    return this.repository.find({
      order: { puntuacion: 'DESC' },
    });
  }
}