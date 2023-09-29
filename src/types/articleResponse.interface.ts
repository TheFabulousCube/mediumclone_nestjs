import { ArticleEntity } from '../article/article.entity';

export interface ArticleResponseInterface {
  article: {
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
  }
}
