import multer from "multer";

const storage = multer.memoryStorage(); // Or use diskStorage if saving locally
export const upload = multer({ storage });


