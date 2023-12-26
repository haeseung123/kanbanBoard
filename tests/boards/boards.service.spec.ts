import { Test, TestingModule } from '@nestjs/testing';
import { BoardsService } from '../../src/boards/boards.service';

describe('BoardsService', () => {
	let service: BoardsService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [BoardsService],
		}).compile();

		service = module.get<BoardsService>(BoardsService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
