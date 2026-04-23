// import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs-extra';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid'; // npm install uuid

// @Injectable()
export class UploadService {
  private readonly uploadDir: string;
  // private readonly logger = new Logger(UploadService.name);

  constructor(private configService: ConfigService) {
    this.uploadDir = path.resolve(path.join(process.cwd(), 'uploads'));
    fs.ensureDirSync(this.uploadDir);
  }

  async saveFile(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    file: Express.Multer.File,
    folder: string = 'general',
  ): Promise<string> {
    this.validateFile(file);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const ext = path.extname(file.originalname);
    const safeName = `${uuidv4()}${ext}`;
    const folderPath = path.join(this.uploadDir, folder);
    fs.ensureDirSync(folderPath);

    const filePath = path.join(folderPath, safeName);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    await fs.writeFile(filePath, file.buffer);

    // this.logger.log(`Файл сохранён: ${filePath}`);
    // Возвращаем путь относительно корня раздачи статики
    return `http://localhost:${process.env.PORT}/uploads/${folder}/${safeName}`;
  }

  private validateFile(file: Express.Multer.File) {
    // const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    // const maxSize = 5 * 1024 * 1024; // 5 MB
    // if (!allowedMimes.includes(file.mimetype)) {
    //   throw new BadRequestException(
    //     `Тип файла не поддерживается. Разрешены: ${allowedMimes.join(', ')}`,
    //   );
    // }
    // // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    // if (file.size > maxSize) {
    //   throw new BadRequestException('Размер файла не должен превышать 5 МБ');
    // }
  }
}