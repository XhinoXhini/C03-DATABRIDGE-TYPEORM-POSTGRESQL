import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSneakerDto } from './create-sneaker.dto';
import { Sneaker } from './sneaker.entity';
import { UpdateSneakerDto } from './update-sneaker.dto';

@Injectable()
export class SneakersService implements OnModuleInit {
  constructor(
    @InjectRepository(Sneaker)
    private readonly repository: Repository<Sneaker>,
  ) {}

  async onModuleInit(): Promise<void> {
    if ((await this.repository.count()) === 0) {
      await this.repository.save([
        this.repository.create({
          marca: 'Nike',
          modelo: 'Air Max 1',
          precio: 149.99,
          talla: 42,
          stock: 4,
        }),
        this.repository.create({
          marca: 'Adidas',
          modelo: 'Forum Low',
          precio: 110.0,
          talla: 43,
          stock: 0, // Agotado
        }),
      ]);
    }
  }

  findAll(): Promise<Sneaker[]> {
    return this.repository.find({ order: { id: 'DESC' } });
  }

  async findOne(id: number): Promise<Sneaker> {
    const sneaker = await this.repository.findOneBy({ id });
    if (!sneaker) throw new NotFoundException('Sneaker no encontrada');
    return sneaker;
  }

  create(dto: CreateSneakerDto): Promise<Sneaker> {
    return this.repository.save(this.repository.create(dto));
  }

  async update(id: number, dto: UpdateSneakerDto): Promise<Sneaker> {
    const sneaker = await this.findOne(id);
    this.repository.merge(sneaker, dto);
    return this.repository.save(sneaker);
  }

  async remove(id: number): Promise<void> {
    const sneaker = await this.findOne(id);
    await this.repository.remove(sneaker);
  }
}