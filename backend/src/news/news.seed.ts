import { AppDataSource } from '../database/data-source';
import { News } from './entities/news.entity';
import { CreateNewsDto } from './dto/create-news.dto';

export const newsSeeds = async () => {
  const newsRepo = AppDataSource.getRepository(News);
  const newsTitles = [
    'one',
    'two',
    'three',
    'four',
    'five',
    'six',
    'seven',
    'eight',
    'nine',
    'ten',
    'eleven',
    'twelve',
    'thirteen',
    'fourteen',
    'fifteen',
    'sixteen',
    'seventeen',
    'eighteen',
    'nineteen',
    'twenty',
    'twenty-one',
    'twenty-two',
    'twenty-three',
    'twenty-four',
    'twenty-five',
    'twenty-six',
    'twenty-seven',
    'twenty-eight',
    'twenty-nine',
    'thirt',
  ];

  const newsText =
    'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.';

  const newsSeeds: (CreateNewsDto & { created_at: Date })[] = [];

  for (const title of newsTitles) {
    newsSeeds.push({
      title: `${title} news`,
      news_text: newsText.slice(0, Math.floor(Math.random() * newsText.length)),
      author_id: 1,
      image: `http://localhost:${process.env.PORT}/uploads/360_F_77606013_X188cE6Zdy13xJJeMVOd2JqYhyiNoJNC.jpg`,
      created_at: new Date(
        new Date().setDate(
          new Date().getDate() - Math.random() * (10000 - 1000) + 1000,
        ),
      ),
    });
  }

  await newsRepo.save(newsSeeds);

  console.log(`Seeded ${newsSeeds.length} news`);
};
