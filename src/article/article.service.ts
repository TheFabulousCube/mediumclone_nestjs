import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateArticleDto } from '../dto/createArticle.dto';
import { UserEntity } from '../user/user.entity';
import { DataSource, DeleteResult, In, Repository } from 'typeorm';
import { ArticleResponseInterface } from '../types/articleResponse.interface';
import { ArticleEntity } from './article.entity';
import slugify from 'slugify';
import { UpdateArticleDto } from '../dto/updateArticle.dto';
import { ArticlesResponseInterface } from '../types/articlesResponse.interface';
import { findAllArticlesQueryInterface } from '../types/findAllArticlesQuery.Interface';
import { TagEntity } from '../tag/tag.entity';
import { TagService } from '../tag/tag.service';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly tagService: TagService,
    private dataSource: DataSource,
  ) {}

  async findAll(
    userId: number,
    query: findAllArticlesQueryInterface,
  ): Promise<any> {
    const queryBuilder = this.dataSource
      .getRepository(ArticleEntity)
      .createQueryBuilder('articles')
      .leftJoinAndSelect('articles.author', 'author');

    if (query.tag) {
      queryBuilder.andWhere('articles.tagList LIKE :tag', {
        tag: `%${query.tag}%`,
      });
    }

    if (query.favorited) {
      const favoriter = await this.userRepository.findOne({
        where: { username: query.favorited },
        relations: ['favorites'],
      });
      const ids = favoriter?.favorites.map((el) => el.id);
      if (ids?.length > 0) {
        queryBuilder.andWhere('articles.id IN (:...ids)', { ids: ids });
      } else {
        queryBuilder.andWhere('1=0');
      }
    }

    if (query.author) {
      const author = await this.userRepository.findOne({
        where: { username: query.author },
      });
      queryBuilder.andWhere('articles.authorId = :id', { id: author.id });
    }
    const articlesCount = await queryBuilder.getCount();

    if (query.limit) {
      queryBuilder.limit(query.limit);
    }
    if (query.offset) {
      queryBuilder.offset(query.offset);
    }

    let favoriteIds: number[];
    if (userId) {
      const currentUser = await this.userRepository.findOne({
        where: { id: userId },
        relations: ['favorites'],
      });
      favoriteIds = currentUser.favorites.map((favorite) => favorite.id);
    }
    const articles = await queryBuilder.getMany();
    const articlesWithFavorited = articles.map((article) => {
      const favorited = favoriteIds?.includes(article.id);
      article.id = undefined;
      return { ...article, favorited };
    });
    return { articles: articlesWithFavorited, articlesCount };
  }

  async getSingleArticle(slug: string): Promise<ArticleEntity> {
    const single = await this.articleRepository.findOne({
      relations: { author: true },
      where: { slug: slug },
    });
    return single;
  }

  async createArticle(
    currentUser: UserEntity,
    createArticleDto: CreateArticleDto,
  ): Promise<ArticleEntity> {
    const article = new ArticleEntity();
    Object.assign(article, createArticleDto);
    if (!createArticleDto.tagList) {
      article.tagList = [];
    }
    article.author = currentUser;
    article.slug = this.getSlug(createArticleDto.title);
    await this.tagService.saveAll(createArticleDto.tagList);
    return await this.articleRepository.save(article);
  }

  async updateArticle(
    user: UserEntity,
    updateArticleDto: UpdateArticleDto,
    slug: string,
  ): Promise<ArticleEntity> {
    const article = await this.articleRepository.findOneBy({ slug: slug });
    if (!article) {
      throw new HttpException('Article is not found', HttpStatus.NOT_FOUND);
    }
    if (user.id != article.author.id) {
      throw new HttpException(
        'Only the Author may delete an article',
        HttpStatus.FORBIDDEN,
      );
    }
    if (user.id === article.author.id) {
      Object.assign(article, updateArticleDto);
      article.slug = this.getSlug(updateArticleDto.title);
    }
    return await this.articleRepository.save(article);
  }

  async deleteArticle(user: UserEntity, slug: string): Promise<DeleteResult> {
    const article = await this.articleRepository.findOneBy({ slug: slug });
    if (!article) {
      throw new HttpException('Article is not found', HttpStatus.NOT_FOUND);
    }
    if (user.id != article.author.id) {
      throw new HttpException(
        'Only the Author may delete an article',
        HttpStatus.FORBIDDEN,
      );
    }
    return await this.articleRepository.delete({ slug });
  }

  async addArticleToFavorites(
    userId: number,
    slug: string,
  ): Promise<ArticleResponseInterface> {
    const article = await this.articleRepository.findOne({
      where: { slug: slug },
      relations: ['author'],
    });
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['favorites'],
    });

    const isFavorited = user.favorites.some(
      (favorite) => favorite.id === article?.id,
    );
    if (!isFavorited && article !== null) {
      user.favorites.push(article);
      article.favoritesCount++;
      await this.userRepository.save(user);
      await this.articleRepository.save(article);
    }
    const response = article.toSingleArticle();
    response.article.favorited = true;
    return response;
  }

  async removeArticleFromFavorites(
    userId: number,
    slug: string,
  ): Promise<ArticleResponseInterface> {
    const article = await this.articleRepository.findOne({
      where: { slug: slug },
      relations: ['author'],
    });
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['favorites'],
    });

    const isFavorited = user.favorites.some(
      (favorite) => favorite.id === article?.id,
    );
    if (isFavorited) {
      user.favorites = user.favorites.filter(
        (favorite) => favorite.id !== article.id,
      );
      article.favoritesCount--;
      await this.userRepository.save(user);
      await this.articleRepository.save(article);
    }
    const response = article.toSingleArticle();
    response.article.favorited = false;
    return response;
  }

  async getFeed(
    userId: number,
    query: findAllArticlesQueryInterface,
  ): Promise<ArticlesResponseInterface> {
    const queryBuilder = this.dataSource
      .getRepository(ArticleEntity)
      .createQueryBuilder('articles')
      .leftJoinAndSelect('articles.author', 'author');
    const articlesCount = await queryBuilder.getCount();

    if (query.limit) {
      queryBuilder.limit(query.limit);
    }
    if (query.offset) {
      queryBuilder.offset(query.offset);
    }
    // Authentication required, will return multiple articles created by followed users, ordered by most recent first.
    if (userId) {
      const currentUser = await this.userRepository.findOne({
        where: { id: userId },
        relations: ['following', 'favorites'],
      });

      const following = currentUser.following.map((follow) => {
        return follow.id;
      });
      const articles = await this.articleRepository.find({
        where: { author: In(following) },
        order: { createdAt: 'DESC' },
        skip: query.offset,
        take: query.limit,
      });
      const articlesWithFavorited = articles.map((article) => {
        const favorited = currentUser.favorites.some(
          (favs) => favs.id === article.id,
        );
        article.id = undefined;
        return { ...article, favorited };
      });
      return { articles: articlesWithFavorited, articlesCount };
    }
    return ' return from service' as unknown as ArticlesResponseInterface;
  }

  buildArticleResponse(article: ArticleEntity): ArticleResponseInterface {
    return article?.toSingleArticle();
  }
  buildArticlesResponse(
    articleList: ArticleEntity[],
  ): ArticlesResponseInterface {
    const articles = articleList.map(
      (article) => article.toSingleArticle().article,
    );
    return { articles: articles, articlesCount: articles.length };
  }

  private getSlug(title: string): string {
    return (
      slugify(title, { lower: true }) +
      '-' +
      (Math.random() * Date.now()).toString(36)
    );
  }
}
