import { newsSeeds } from '../../news/news.seed';
import { usersSeeds } from '../../user/user.seed';
import { AppDataSource } from '../data-source';

const runAll = async () => {
  await AppDataSource.initialize();

  try {
    await usersSeeds();
    await newsSeeds();
    console.log('All seeds completed successfully.');
    process.exit(0);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
};

runAll().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
