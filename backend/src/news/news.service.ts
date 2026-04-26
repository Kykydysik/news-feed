import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { News } from './entities/news.entity';
import { UploadService } from '../upload/upload.service';
import { WsEventsGateway } from '../realtime/ws-events.gateway';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { NEWS_GENERATION_JOB, NEWS_GENERATION_QUEUE } from './news.constants';
import { json2csv } from 'json-2-csv';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News)
    private newsRepository: Repository<News>,
    private readonly uploadService: UploadService,
    private readonly wsEventsGateway: WsEventsGateway,
    @InjectQueue(NEWS_GENERATION_QUEUE)
    private readonly newsGenerationQueue: Queue<{
      runId: string;
      userId: number;
    }>,
  ) {}

  async create(
    id: number,
    createNewsDto: CreateNewsDto,
    file?: Express.Multer.File,
  ) {
    let image: string | undefined = undefined;

    if (file) {
      image = await this.uploadService.saveFile(file, 'news');
    }

    const newItem = this.newsRepository.create({
      ...createNewsDto,
      image,
      created_at: new Date(),
      author: { id },
    });

    const news = await this.newsRepository.save(newItem);

    this.wsEventsGateway.emitToAll(news, 'news-added');

    return news;
  }

  async findAll({
    limit,
    offset,
    sort,
  }: {
    limit: number;
    offset: number;
    sort: 'ASC' | 'DESC';
  }) {
    const [items, totalCount] = await this.newsRepository.findAndCount({
      take: limit,
      skip: offset,
      order: {
        created_at: sort,
      },
    });

    return {
      items,
      totalCount,
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} news`;
  }

  async update(
    id: number,
    updateNewsDto: UpdateNewsDto,
    file?: Express.Multer.File,
  ) {
    let image: string | undefined = undefined;

    if (file) {
      image = await this.uploadService.saveFile(file, 'news');
    }

    return this.newsRepository.update(id, {
      ...updateNewsDto,
      image,
    });
  }

  remove(id: number) {
    return this.newsRepository.delete(id);
  }

  async downloadNews(userId: number) {
    // на досуге надо будет в отдельный сервис вынести со своей таблицей
    await this.newsGenerationQueue.add(
      NEWS_GENERATION_JOB,
      {
        runId: '1',
        userId
      },
      {
        removeOnComplete: 100,
        removeOnFail: 100,
      },
    );

    this.wsEventsGateway.emitToUser(
      userId,
      {
        message: 'Началось формирование отчета',
      },
      'start-create-report',
    );

    return;
  }

  async getAllItemsForReport() {
    return this.newsRepository.find();
  }
}
