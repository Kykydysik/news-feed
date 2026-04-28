import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { BullModule } from '@nestjs/bullmq';
import { ReportRunsProcessor } from './reports.processor';
import { REPORT_GENERATION_QUEUE } from './report.constants'
import { RealtimeModule } from '../realtime/realtime.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from './entities/report.entity';
import { UploadModule } from '../upload/upload.module';
import { NewsModule } from '../news/news.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Report]),
    BullModule.registerQueue({
      name: REPORT_GENERATION_QUEUE,
    }),
    UploadModule,
    RealtimeModule,
    NewsModule,
  ],
  controllers: [ReportsController],
  providers: [ReportsService, ReportRunsProcessor],
})
export class ReportsModule {}
