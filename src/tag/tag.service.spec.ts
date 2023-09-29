import { Test, TestingModule } from '@nestjs/testing';
import { TagService } from './tag.service';
import { TagEntity } from './tag.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

const mockTags = ['dragons', 'coffee', 'birds', 'plants'];
const mockTagEntities = mockTags.map((tag, index) => ({
  id: index,
  name: tag,
}));

describe('TagService', () => {
  let service: TagService;
  let tagRepository: Repository<TagEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TagService,
        {
          provide: getRepositoryToken(TagEntity),
          useValue: {
            find: jest.fn(() => {
              return Promise.resolve(mockTagEntities);
            }),
            save: jest.fn(),
          },
        },
      ],
    }).compile();
    service = module.get<TagService>(TagService);
    tagRepository = module.get<Repository<TagEntity>>(
      getRepositoryToken(TagEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all tags', async () => {
    await expect(service.findAll()).resolves.toBe(mockTagEntities);
  });

  it('should save all tags', async () => {
    await expect(service.saveAll(mockTags)).resolves;
  });
});
