import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsService } from './news.service';
import { NewsController } from './news.controller';
import { News } from './entities/news.entity';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { UploadModule } from '../upload/upload.module';
import { RealtimeModule } from '../realtime/realtime.module';
import { BullModule } from '@nestjs/bullmq';
import { NEWS_GENERATION_QUEUE } from './news.constants';
import { ReportRunsProcessor } from './news-report.processor';

MulterModule.register({
  storage: memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

@Module({
  imports: [
    TypeOrmModule.forFeature([News]),
    UploadModule,
    RealtimeModule,
    BullModule.registerQueue({
      name: NEWS_GENERATION_QUEUE,
    }),
  ],
  controllers: [NewsController],
  providers: [NewsService, ReportRunsProcessor],
})
export class NewsModule {}
