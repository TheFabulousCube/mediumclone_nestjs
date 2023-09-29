import { ArticleType } from './article.type';
import { ArticleResponseInterface } from './articleResponse.interface';

export interface ArticlesResponseInterface {
  articles: {
    slug: string,
    title: string,
    description: string,
    body: string,
    tagList: string[],
    createdAt: Date,
    updatedAt: Date,
    favorited?: boolean,
    favoritesCount: number,
    author: {
      username: string,
      bio: string,
      image: string
    }
  }[],
  articlesCount: number
}
