import { injectable } from 'inversify';
import logger from '../shared/libs/logger.js';
import config from '../config/index.js';

@injectable()
export class Application {
  public init(): void {
    logger.info(`application initialized on port ${config.port}`);
  }
}
