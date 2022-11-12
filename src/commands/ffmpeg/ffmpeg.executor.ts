import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import { CommandExecutor } from '../../core/executor/command.executor';
import { FileService } from '../../core/files/file.service';
import { IStreamLogger } from '../../core/handlers/stream-logger.interface';
import { StreamHandler } from '../../core/handlers/stream.handler';
import { PromtService } from '../../core/promt/promt.service';
import { FfmpegBuilder } from './ffmpeg.builder';
import { ICommandExecFfmpeg, IFfmpegInput } from './ffmpeg.types';

export class FfmpegExecutor extends CommandExecutor<IFfmpegInput> {
	private fileSerive: FileService = new FileService();
	private promtService: PromtService = new PromtService();

	constructor(logger: IStreamLogger) {
		super(logger);
	}

	protected async promt(): Promise<IFfmpegInput> {
		const width = await this.promtService.input<number>('Ширина', 'number');
		const height = await this.promtService.input<number>('Высота', 'number');
		const path = await this.promtService.input<string>(
			'Путь до файла',
			'input'
		);
		const name = await this.promtService.input<string>('Имя файла', 'input');
		return {
			width,
			height,
			path,
			name,
		};
	}

	protected build({
		width,
		height,
		path,
		name,
	}: IFfmpegInput): ICommandExecFfmpeg {
		const output = this.fileSerive.getFilePath(path, name, 'mp4');
		const args = new FfmpegBuilder()
			.input(path)
			.setVideoSize(width, height)
			.output(output);
		return { command: 'ffmpeg', args, output };
	}

	protected spawn({
		command,
		args,
		output,
	}: ICommandExecFfmpeg): ChildProcessWithoutNullStreams {
		this.fileSerive.deleteFileIfExists(output);
		return spawn(command, args);
	}

	protected proccessStream(
		stream: ChildProcessWithoutNullStreams,
		logger: IStreamLogger
	): void {
		const handler = new StreamHandler(logger);
		handler.processOutput(stream);
	}
}
