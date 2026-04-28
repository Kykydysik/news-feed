import { IsString, IsIn } from 'class-validator';

export enum ReportStatuses {
  Process = 'process',
  Ready = 'ready',
  Error = 'error',
}

export enum ReportTypes {
  News = 'news',
}

export class CreateReportDto {
  @IsString()
  @IsIn(Object.values(ReportTypes), { each: true })
  type: ReportTypes;
}
