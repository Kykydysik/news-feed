import { AppDataSource } from '../database/data-source';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

export const usersSeeds = async () => {
  const userRepo = AppDataSource.getRepository(User);

  const userSeeds: CreateUserDto[] = [
    {
      first_name: 'First User',
      last_name: 'First User',
      email: 'test@test.ru',
      birth_day: new Date().toISOString(),
      avatar: `http://localhost:${process.env.PORT}/uploads/360_F_77606013_X188cE6Zdy13xJJeMVOd2JqYhyiNoJNC.jpg`,
      password: '123',
      information: 'information',
      phone: '123456789',
    },
  ];

  await userRepo.save(userSeeds);

  console.log(`Seeded ${userSeeds.length} user`);
};
