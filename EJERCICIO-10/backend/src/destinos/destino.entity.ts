import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('destinos')
export class Destino {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ciudad: string;

  @Column()
  pais: string;

  @Column()
  descripcion: string;

  // Mejora propia: estado de visita y prioridad
  @Column({ default: false })
  visitado: boolean;

  @Column({ default: 'Media' })
  prioridad: string;
}