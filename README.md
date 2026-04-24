## Test News Feed

To start the project, you need to register the database data (POSTGRES_USER and POSTGRES_PASSWORD) in .env.
Then run the project using the command

```bash
docker compose up -d --build
```

Then run the migrations
```bash
docker compose exec backend npm run migration:run
```

And then add seeds
```bash
docker compose exec backend npm run db:seed
```

That's all - you can test the project.
