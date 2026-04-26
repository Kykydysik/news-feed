import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { NEWS_GENERATION_JOB, NEWS_GENERATION_QUEUE } from './news.constants';
import { NewsService } from './news.service';
import { json2csv } from 'json-2-csv';
import { UploadService } from '../upload/upload.service';
import { WsEventsGateway } from '../realtime/ws-events.gateway';

@Processor(NEWS_GENERATION_QUEUE)
export class ReportRunsProcessor extends WorkerHost {
  constructor(
    private readonly newsService: NewsService,
    private readonly uploadService: UploadService,
    private readonly wsEventsGateway: WsEventsGateway,
  ) {
    super();
  }

  async process(job: Job<{ runId: string; userId: number }>) {
    if (job.name !== NEWS_GENERATION_JOB) {
      return;
    }

    try {
      const rows = await this.newsService.getAllItemsForReport();
      const fileUrl = await this.uploadService.saveGeneratedFile(
        json2csv(rows),
        'news-report.csv',
        'reports',
      );

      this.wsEventsGateway.emitToUser(
        job.data.userId,
        {
          link: fileUrl,
        },
        'create-report-success',
      );
    } catch (error) {
      console.log(error);
    }

    //   await this.reportRunsService.markRunReady(
    //     job.data.runId,
    //     artifact,
    //     job.data.baseUrl,
    //   );

  }
}
