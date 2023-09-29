import { BeforeInsert, BeforeUpdate, Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { hash } from 'bcrypt';
import { UserResponseInterface } from '../types/userResponse.interface';
import { ArticleEntity } from '../article/article.entity';

@Entity({ name: 'users' })
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    email: string;

    @Column({ default: '' })
    bio: string;

    @Column({ default: '' })
    image: string;

    @Column({ select: false })
    password: string;

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        this.password = await hash(this.password, 10);
    }

    @ManyToMany(() => ArticleEntity)
    @JoinTable()
    favorites: ArticleEntity[]

    @ManyToMany(() => UserEntity, (user) => user.following)
    @JoinTable()
    followers: UserEntity[];

    @ManyToMany(() => UserEntity, (user) => user.followers)
    following: UserEntity[];

    @OneToMany(() => ArticleEntity, (article) => article.author)
    articles: ArticleEntity[];

    public toUserResponseInterface(token: string): UserResponseInterface {
        return {
            user: {
                email: this.email,
                token: token,
                username: this.username,
                bio: this.bio,
                image: this.image
            }
        }
    }
}

