import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UploadService } from '../upload/upload.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly uploadService: UploadService,
  ) {}

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return this.usersRepository.findOne({
      where: { id },
    });
  }

  findByEmail(email: string) {
    // убрать поля типа password
    return this.usersRepository.findOne({
      where: { email },
    });
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
    file?: Express.Multer.File,
  ) {
    let avatar: string | undefined = undefined;
    const currentUser = await this.usersRepository.findOne({
      where: { id },
    });

    console.log({
      ...currentUser,
      ...updateUserDto,
      avatar,
    });

    if (file) {
      avatar = await this.uploadService.saveFile(file, 'news');
    }

    return this.usersRepository.update(id, {
      ...currentUser,
      ...updateUserDto,
      avatar,
    });
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
