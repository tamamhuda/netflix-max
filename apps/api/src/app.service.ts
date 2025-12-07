import { Injectable } from '@nestjs/common';
import { APP_CONFIG } from '@netflix-max/config';

@Injectable()
export class AppService {
  getHealth() {
    return {
      status: 'ok',
      app: APP_CONFIG.NAME,
      version: APP_CONFIG.VERSION,
      timestamp: new Date().toISOString(),
    };
  }
}
