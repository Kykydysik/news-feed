import { Injectable } from '@nestjs/common';
import {
  CreateReportDto,
  ReportStatuses,
  ReportTypes,
} from './dto/create-report.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './entities/report.entity';
import { Repository } from 'typeorm';
import { WsEventsGateway } from '../realtime/ws-events.gateway';
import { Queue } from 'bullmq';
import { REPORT_GENERATION_JOB } from './report.constants';
import { InjectQueue } from '@nestjs/bullmq';
import { REPORT_GENERATION_QUEUE } from './report.constants';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,
    private readonly wsEventsGateway: WsEventsGateway,
    @InjectQueue(REPORT_GENERATION_QUEUE)
    private readonly reportGenerationQueue: Queue<{
      runId: string;
      userId: number;
      type: ReportTypes;
    }>,
  ) {}

  async create(createReportDto: CreateReportDto, userId: number) {
    const report = this.reportRepository.create({
      type: createReportDto.type,
      status: ReportStatuses.Process,
    });

    await this.reportRepository.save(report);

    await this.reportGenerationQueue.add(REPORT_GENERATION_JOB, {
      runId: String(report.id),
      userId,
      type: createReportDto.type,
    });

    this.wsEventsGateway.emitToUser(
      userId,
      {
        message: 'Началось формирование отчета',
      },
      'start-create-report',
    );
  }

  findOne(id: number) {
    return `This action returns a #${id} report`;
  }

  // findAll() {
  //   return `This action returns all reports`;
  // }
  //
  //
  // update(id: number, updateReportDto: UpdateReportDto) {
  //   return `This action updates a #${id} report`;
  // }
  //
  // remove(id: number) {
  //   return `This action removes a #${id} report`;
  // }
}
