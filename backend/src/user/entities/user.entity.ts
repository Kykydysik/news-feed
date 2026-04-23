import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 100 })
  first_name: string;

  @Column({ type: 'varchar', length: 100 })
  last_name: string;

  @Column({ type: 'varchar', length: 512, nullable: true })
  avatar: string;

  @Column({ type: 'text', nullable: true })
  information: string;

  @Column({ type: 'varchar', length: 254, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 32, unique: true, nullable: true })
  phone: string;

  @Column({ type: 'varchar', length: 32, nullable: false })
  password: string;

  @Column({ type: 'date' })
  birth_day: Date;

  @CreateDateColumn({
    type: 'timestamp with time zone',
    default: new Date().toISOString(),
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp with time zone',
    default: new Date().toISOString(),
  })
  updated_at: Date;
}
