import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Evento } from './evento.entity';

@Injectable()
export class EventosService implements OnModuleInit {
  constructor(
    @InjectRepository(Evento)
    private readonly repository: Repository<Evento>,
  ) {}

  async onModuleInit(): Promise<void> {
    if ((await this.repository.count()) === 0) {
      await this.repository.save([
        this.repository.create({
          nombre: 'Tech Meetup',
          ciudad: 'Zaragoza',
          categoria: 'Tecnología',
          fecha: '2027-03-12',
        }),
        this.repository.create({
          nombre: 'Festival Indie',
          ciudad: 'Zaragoza',
          categoria: 'Música',
          fecha: '2027-04-20',
        }),
        this.repository.create({
          nombre: 'AI Summit',
          ciudad: 'Madrid',
          categoria: 'Tecnología',
          fecha: '2027-05-18',
        }),
      ]);
    }
  }

  // Reto MODIFÍCALO: acepta ambos parámetros como filtros opcionales combinables
  findAll(ciudad?: string, categoria?: string): Promise<Evento[]> {
    const where: FindOptionsWhere<Evento> = {};

    if (ciudad) {
      where.ciudad = ciudad;
    }

    if (categoria) {
      where.categoria = categoria;
    }

    return this.repository.find({
      where,
      order: { fecha: 'ASC' },
    });
  }
}