import { Column, PrimaryGeneratedColumn, Entity } from 'typeorm';
import { IsString } from 'class-validator';
import { ReportStatuses, ReportTypes } from '../dto/create-report.dto';

@Entity('reports')
export class Report {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @IsString()
  @Column({ type: 'enum', enum: ReportTypes })
  type: ReportTypes;

  @IsString()
  @Column({ type: 'enum', enum: ReportStatuses })
  status: ReportStatuses;
}
