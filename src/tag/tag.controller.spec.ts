import { Test, TestingModule } from '@nestjs/testing';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';


const tags = ['dragons', 'coffee', 'birds', 'plants'];

const mockTagService = {
  findAll: jest.fn(() => {
    return Promise.resolve(tags.map((tag, index) => ({id: index, name: tag})));
  }),
};

describe('TagController', () => {
  let tagController: TagController;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [TagController],
      providers: [
        {
          provide: TagService,
          useValue: mockTagService,
        },
      ],
    }).compile();

    tagController = moduleRef.get<TagController>(TagController);
  });

  describe('tag controller', () => {
    it('should return a list of tags', async () => {
      const value = await tagController.getTags();
      expect(value).toEqual({
        tags: tags,
      });
    });
  });
});
