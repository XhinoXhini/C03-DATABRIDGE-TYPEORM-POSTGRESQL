import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDestinoDto } from './create-destino.dto';
import { Destino } from './destino.entity';
import { UpdateDestinoDto } from './update-destino.dto';

@Injectable()
export class DestinosService implements OnModuleInit {
  constructor(
    @InjectRepository(Destino)
    private readonly repository: Repository<Destino>,
  ) {}

  async onModuleInit(): Promise<void> {
    if ((await this.repository.count()) === 0) {
      await this.repository.save([
        this.repository.create({
          ciudad: 'Reikiavik',
          pais: 'Islandia',
          descripcion: 'Auroras boreales y baños termales',
          visitado: false,
          prioridad: 'Alta',
        }),
        this.repository.create({
          ciudad: 'Lisboa',
          pais: 'Portugal',
          descripcion: 'Tranvías, miradores y pasteles de nata',
          visitado: true,
          prioridad: 'Media',
        }),
      ]);
    }
  }

  findAll(): Promise<Destino[]> {
    return this.repository.find({ order: { id: 'DESC' } });
  }

  async findOne(id: number): Promise<Destino> {
    const destino = await this.repository.findOneBy({ id });
    if (!destino) throw new NotFoundException('Destino no encontrado');
    return destino;
  }

  create(dto: CreateDestinoDto): Promise<Destino> {
    const nuevo = this.repository.create(dto);
    return this.repository.save(nuevo);
  }

  async update(id: number, dto: UpdateDestinoDto): Promise<Destino> {
    const destino = await this.findOne(id);
    this.repository.merge(destino, dto);
    return this.repository.save(destino);
  }

  async remove(id: number): Promise<void> {
    const destino = await this.findOne(id);
    await this.repository.remove(destino);
  }
}