import Busboy from 'busboy';

/**
 * Custom middleware to parse multipart/form-data for Firebase Functions
 * Replaces Multer to natively handle Firebase's rawBody stream consumption.
 */
export const firebaseUpload = (req, res, next) => {
    if ((req.method !== 'POST' && req.method !== 'PUT') || !req.headers['content-type']?.includes('multipart/form-data')) {
        return next();
    }

    const busboy = Busboy({ headers: req.headers, limits: { fileSize: 10 * 1024 * 1024 } });

    req.body = req.body || {};

    busboy.on('field', (fieldname, val) => {
        req.body[fieldname] = val;
    });

    busboy.on('file', (fieldname, file, info) => {
        const { filename, encoding, mimeType } = info;
        const buffers = [];

        file.on('data', (data) => buffers.push(data));

        file.on('end', () => {
            const buffer = Buffer.concat(buffers);
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf', 'application/octet-stream'];

            // Cloudinary handles format mismatches securely, but we verify here as well
            if (!allowedTypes.includes(mimeType) && !fieldname.includes('images')) {
                req.fileValidationError = `Invalid file type: ${mimeType}`;
                return;
            }

            const fileObj = {
                fieldname,
                originalname: filename,
                encoding,
                mimetype: mimeType,
                buffer: buffer,
                size: buffer.length
            };

            // 1. Single file emulation (profilePicture, coverPhoto)
            req.file = fileObj;

            // 2. Array emulation for post images
            if (fieldname === 'images') {
                if (!req.files || !Array.isArray(req.files)) req.files = [];
                req.files.push(fileObj);
            }
            // 3. Object emulation for registration fields (profilePicture, idCard)
            else {
                if (!req.files || Array.isArray(req.files)) req.files = {};
                if (!req.files[fieldname]) req.files[fieldname] = [];
                req.files[fieldname].push(fileObj);
            }
        });
    });

    busboy.on('finish', () => {
        if (req.fileValidationError) {
            return res.status(400).json({ success: false, message: req.fileValidationError });
        }
        next();
    });

    busboy.on('error', (err) => {
        console.error('Busboy Parsing Error:', err);
        res.status(500).json({ success: false, message: 'File upload parsing failed' });
    });

    if (req.rawBody) {
        busboy.end(req.rawBody);
    } else {
        req.pipe(busboy);
    }
};
