import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { ConfigModule } from '@nestjs/config'; // если сервис использует ConfigService

@Module({
  imports: [ConfigModule],
  providers: [UploadService],
  exports: [UploadService],
})

export class UploadModule {}