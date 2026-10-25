import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('mascotas')
export class Mascota {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  raza: string;

  @Column()
  edad: number;

  @Column()
  ciudad: string;

  // Campo añadido para el reto MODIFÍCALO
  @Column({ default: 'Media' })
  nivelEnergia: string;
}