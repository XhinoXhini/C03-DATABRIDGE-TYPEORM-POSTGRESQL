import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('sneakers')
export class Sneaker {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  marca: string;

  @Column()
  modelo: string;

  @Column('decimal', { precision: 6, scale: 2 })
  precio: number;

  @Column()
  talla: number;

  // Campo añadido para el reto MODIFÍCALO
  @Column({ default: 0 })
  stock: number;
}