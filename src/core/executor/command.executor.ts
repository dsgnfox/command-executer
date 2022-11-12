import { ChildProcessWithoutNullStreams } from 'child_process';
import { IStreamLogger } from '../handlers/stream-logger.interface';
import { ICommandExec } from './command.types';

export abstract class CommandExecutor<Input> {
	constructor(private logger: IStreamLogger) {}

	public async execute() {
		const input = await this.promt();
		const command = this.build(input);
		const stream = this.spawn(command);
		this.proccessStream(stream, this.logger);
	}

	protected abstract promt(): Promise<Input>;
	protected abstract build(input: Input): ICommandExec;
	protected abstract spawn(
		command: ICommandExec
	): ChildProcessWithoutNullStreams;
	protected abstract proccessStream(
		stream: ChildProcessWithoutNullStreams,
		logger: IStreamLogger
	): void;
}
