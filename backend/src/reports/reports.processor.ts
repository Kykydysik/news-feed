import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import {
  REPORT_GENERATION_QUEUE,
  REPORT_GENERATION_JOB,
} from './report.constants';
import { json2csv } from 'json-2-csv';
import { UploadService } from '../upload/upload.service';
import { WsEventsGateway } from '../realtime/ws-events.gateway';
import { ReportTypes } from './dto/create-report.dto';
import { NewsService } from '../news/news.service';

@Processor(REPORT_GENERATION_QUEUE)
export class ReportRunsProcessor extends WorkerHost {
  constructor(
    private readonly uploadService: UploadService,
    private readonly newsService: NewsService,
    private readonly wsEventsGateway: WsEventsGateway,
  ) {
    super();
  }

  async process(
    job: Job<{ runId: string; userId: number; type: ReportTypes }>,
  ) {
    if (job.name !== REPORT_GENERATION_JOB) {
      return;
    }

    try {
      const rows = await this.getRowsData(job.data.type);
      // here you can expand the report type for any file (that is, transfer another parameter here - the file type and save it in the format we need)
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
  }

  getRowsData(type: ReportTypes) {
    // here we can expand the type of report and compile them based on any criteria.
    switch (type) {
      case ReportTypes.News:
        return this.newsService.getAllItemsForReport();
      default:
        throw new Error('Тип отчета не найден');
    }
  }
}
