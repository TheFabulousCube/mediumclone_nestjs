import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Query, Req, UseGuards, UsePipes } from '@nestjs/common';
import { ArticleResponseInterface } from '../types/articleResponse.interface';
import { ExpressRequest } from '../types/expressRequest.interface';
import { CreateArticleDto, createArticleSchema } from '../dto/createArticle.dto';
import { AuthGuard } from '../user/guards/auth.guard';
import { JoiValidationPipe } from '../validation.pipe';
import { ArticleService } from './article.service';
import { updateArticleSchema, UpdateArticleDto } from '../dto/updateArticle.dto';
import { query } from 'express';
import { ArticlesResponseInterface } from '../types/articlesResponse.interface';
import { findAllArticlesQueryInterface } from '../types/findAllArticlesQuery.Interface';

@Controller('articles')
export class ArticleController {
    constructor(private readonly articleService: ArticleService) { }

    @Get()
    async findAll(@Req() request: ExpressRequest,
        @Query() query: findAllArticlesQueryInterface): Promise<ArticlesResponseInterface> {

        const articles = await this.articleService.findAll(request.user?.id, query);
        return articles; //this.articleService.buildArticlesResponse(articles);
    }

    @Get('feed')
    @UseGuards(AuthGuard)
    async getFeed(@Req() request: ExpressRequest,
        @Query() query: findAllArticlesQueryInterface): Promise<ArticlesResponseInterface> {

        const articles = await this.articleService.getFeed(request.user?.id, query);
        return articles;
    }

    @Post()
    @UseGuards(AuthGuard)
    @UsePipes(new JoiValidationPipe(createArticleSchema))
    async createArticle(@Req() request: ExpressRequest,
        @Body('article') createArticleDto: CreateArticleDto): Promise<ArticleResponseInterface> {
        const article = await this.articleService.createArticle(request.user, createArticleDto);
        return this.articleService.buildArticleResponse(article);
    }

    @Get(':slug')
    async getSingleArticle(@Param('slug') slug: string): Promise<ArticleResponseInterface> {
        const article = await this.articleService.getSingleArticle(slug);
        return this.articleService.buildArticleResponse(article);
    }

    @Put(':slug')
    @UseGuards(AuthGuard)
    @UsePipes(new JoiValidationPipe(updateArticleSchema))
    async updateArticle(@Req() request: ExpressRequest,
        @Body('article') updateArticleDto: UpdateArticleDto, @Param('slug') slug: string): Promise<ArticleResponseInterface> {
        const article = await this.articleService.updateArticle(request.user, updateArticleDto, slug);
        return this.articleService.buildArticleResponse(article);
    }

    @Post(':slug/favorite')
    @UseGuards(AuthGuard)
    async addArticleToFavorites(
        @Req() request: ExpressRequest,
        @Param('slug') slug: string): Promise<ArticleResponseInterface> {
        const article = await this.articleService.addArticleToFavorites(request.user.id, slug);
        if (article == null) {
            throw new NotFoundException();
        }
        return article;
    }

    @Delete(':slug/favorite')
    @UseGuards(AuthGuard)
    async removeArticleFromFavorites(
        @Req() request: ExpressRequest,
        @Param('slug') slug: string): Promise<ArticleResponseInterface> {
        const article = await this.articleService.removeArticleFromFavorites(request.user.id, slug);
        return article;
    }

    @Delete(':slug')
    async deleteArticle(@Req() request: ExpressRequest, @Param('slug') slug: string) {
        return await this.articleService.deleteArticle(request.user, slug);
    }
}
