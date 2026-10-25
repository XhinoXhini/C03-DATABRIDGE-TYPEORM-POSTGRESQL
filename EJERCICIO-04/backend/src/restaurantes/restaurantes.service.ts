import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRestauranteDto } from './create-restaurante.dto';
import { Restaurante } from './restaurante.entity';

@Injectable()
export class RestaurantesService {
  constructor(
    @InjectRepository(Restaurante)
    private readonly repository: Repository<Restaurante>,
  ) {}

  async create(dto: CreateRestauranteDto): Promise<Restaurante> {
    const restaurante = this.repository.create(dto);
    return this.repository.save(restaurante);
  }
}