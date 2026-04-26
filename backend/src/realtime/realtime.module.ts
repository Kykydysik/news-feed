import { Module } from '@nestjs/common';
import { WsEventsGateway } from './ws-events.gateway';

@Module({
  providers: [WsEventsGateway],
  exports: [WsEventsGateway],
})

export class RealtimeModule {}
