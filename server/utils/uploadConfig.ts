import { diskStorage } from 'multer';

export const fileUploadConfig = {
    storage : diskStorage({
        destination : "./uploads",
        filename : (req , file , cb) => {
          cb(null , `${file.originalname}`)
        }
    }),
    fileFilter : (req , file , cb) => {
    if(file.mimetype.match(/\/(csv)$/)){
        cb(null , true);
    }
    else{
        cb(null , false);
    }
    }
}

