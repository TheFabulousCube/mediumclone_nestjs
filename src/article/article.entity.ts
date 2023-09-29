import { getDataSourceName } from "@nestjs/typeorm";
import { timestamp } from "rxjs";
import { ArticleResponseInterface } from "../types/articleResponse.interface";
import { UserEntity } from "../user/user.entity";
import { BeforeUpdate, Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ArticlesResponseInterface } from "src/types/articlesResponse.interface";

@Entity({name: 'articles'})
export class ArticleEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    slug: string;

    @Column()
    title: string;

    @Column({default: ''})
    description: string;

    @Column({default: ''})
    body: string;
    
    @Column('simple-array')
    tagList: string[];

    @CreateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date;

    @CreateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
    updatedAt: Date;
    
    @Column({default:0})
    favoritesCount: number;

    @BeforeUpdate()
    updateTimestamp() {
        this.updatedAt = new Date();
    }

    @ManyToMany(() => UserEntity)
    favorites: UserEntity[];

    @ManyToOne(() => UserEntity, (user) => user.articles, {eager: true})
    author: UserEntity;

    public toSingleArticle(favorited: boolean = false): ArticleResponseInterface {
        return {
            article: {
                slug: this.slug,
                title: this.title,
                description: this.description,
                body: this.body,
                tagList: this.tagList,
                createdAt: this.createdAt,
                updatedAt: this.updatedAt,
                favorited: favorited,
                favoritesCount: this.favoritesCount,
                author: {
                  username: this.author.username,
                  bio: this.author.bio,
                  image: this.author.image
                }
              }
        }
    }
    // public toArticlesList(): ArticlesResponseInterface {
    //     return {
    //             slug: this.slug,
    //             title: this.title,
    //             description: this.description,
    //             body: this.body,
    //             tagList: this.tagList,
    //             createdAt: this.createdAt,
    //             updatedAt: this.updatedAt,
    //             favoritesCount: this.favoritesCount,
    //             author: {
    //               username: this.author.username,
    //               bio: this.author.bio,
    //               image: this.author.image
    //             }
    //     }
    // }
}