import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ExpressAdapter } from '@bull-board/express';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { createBullBoard } from '@bull-board/api';

@Module({})
export class QueueBoardModule {
  static forRoot() {
    return {
      module: QueueBoardModule,
      imports: [BullModule],
    };
  }

  /**
   * Setup Bull Board UI for queue monitoring
   * Call this in main.ts after app initialization
   */
  static setupBullBoard(queues: any[]) {
    const serverAdapter = new ExpressAdapter();
    serverAdapter.setBasePath('/admin/queues');

    createBullBoard({
      queues: queues.map((queue) => new BullAdapter(queue)),
      serverAdapter,
    });

    return serverAdapter.getRouter();
  }
}
