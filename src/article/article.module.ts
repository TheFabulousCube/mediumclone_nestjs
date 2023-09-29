import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagEntity } from '../tag/tag.entity';
import { TagService } from '../tag/tag.service';
import { UserEntity } from '../user/user.entity';
import { ArticleController } from './article.controller';
import { ArticleEntity } from './article.entity';
import { ArticleService } from './article.service';

@Module({
  imports: [TypeOrmModule.forFeature([ArticleEntity, UserEntity, TagEntity])],
  controllers: [ArticleController],
  providers: [ArticleService, TagService],
  exports: [ArticleService]
})
export class ArticleModule {}
