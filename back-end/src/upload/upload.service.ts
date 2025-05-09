import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import * as path from 'path';

@Injectable()
export class UploadService {
    private readonly uploadDir = 'uploads';

    constructor() {
        this.ensureUploadDirExists();
    }

    private async ensureUploadDirExists() {
        try {
            await fs.access(this.uploadDir);
        } catch {
            await fs.mkdir(this.uploadDir, { recursive: true });
        }
    }

    async saveFile(file: Express.Multer.File): Promise<string> {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname);
        const filename = `${uniqueSuffix}${extension}`;
        const filepath = path.join(this.uploadDir, filename);

        await fs.writeFile(filepath, file.buffer);
        return filename;
    }

    async deleteFile(filename: string): Promise<void> {
        try {
            const filepath = path.join(this.uploadDir, filename);
            await fs.unlink(filepath);
        } catch (error) {
            if (error.code !== 'ENOENT') {
                throw error;
            }
        }
    }
} 