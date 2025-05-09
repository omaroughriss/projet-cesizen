import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import { extname, join } from 'path';

export const multerConfig: MulterOptions = {
    storage: diskStorage({
        destination: join(__dirname, '..', '..', '..', 'uploads'),
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, uniqueSuffix + extname(file.originalname));
        },
    }),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
    fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Seuls les fichiers JPG et PNG sont autorisés!'), false);
        }
        cb(null, true);
    },
}; 