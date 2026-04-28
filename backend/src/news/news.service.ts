import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { News } from './entities/news.entity';
import { UploadService } from '../upload/upload.service';
import { WsEventsGateway } from '../realtime/ws-events.gateway';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News)
    private newsRepository: Repository<News>,
    private readonly uploadService: UploadService,
    private readonly wsEventsGateway: WsEventsGateway,
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

  async getAllItemsForReport() {
    return this.newsRepository.find();
  }
}
