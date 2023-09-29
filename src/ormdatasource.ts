import { DataSource } from 'typeorm';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'tfc_svc',
  password: '8Mickey6',
  database: 'mediumclone',
  entities: ['dist/**/*.entity.js'],
  synchronize: false,
  migrations: ['dist/migrations/**/*.js'],
  // cli: {
  //     migrationsDir: 'src/migration',
  // }mediumclone_nestjs\src\migrations\1685912103307-CreateTags.ts
});

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized! in: ' + __dirname);
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });
export default AppDataSource;
