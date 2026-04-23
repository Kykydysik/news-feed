import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity('news')
export class News {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 100 })
  title: string;

  @Column({ type: 'text' })
  news_text: string;

  @Column({ type: 'date' })
  created_at: Date;

  @Column({ type: 'jsonb' })
  image!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'author_id' })
  author: User;
}
