import { IStreamLogger } from '../../core/handlers/stream-logger.interface';

export class ConsoleLogger implements IStreamLogger {
	private static instanse: ConsoleLogger;

	private constructor() {}

	log(...args: any[]): void {
		console.log(args);
	}
	error(...args: any[]): void {
		console.log(args);
	}
	end(): void {
		console.log('The end!');
	}

	static getInstance(): ConsoleLogger {
		if (!ConsoleLogger.instanse) {
			ConsoleLogger.instanse = new ConsoleLogger();
		}
		return ConsoleLogger.instanse;
	}
}
