import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TagEntity } from './tag.entity';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(TagEntity)
    private readonly tagRepository: Repository<TagEntity>,
  ) {}

  async findAll(): Promise<TagEntity[]> {
    return await this.tagRepository.find();
  }

  async saveAll(list: string[]): Promise<TagEntity[]> {
    const tags: TagEntity[] = list.map((item) => {
      const tag = new TagEntity();
      tag.name = item;
      return tag;
    });
    return await this.tagRepository.save(tags);
  }
}
