const multer = require('multer');

// Configuración de Multer para almacenar archivos en memoria
const storage = multer.memoryStorage();

// Límite de tamaño de archivo (10 MB)
const limits = {
  fileSize: 10 * 1024 * 1024, // 10 MB en bytes
};

// Filtro para aceptar solo ciertos tipos de archivo
const fileFilter = (req, file, cb) => {
  const allowedMimes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
    'text/plain' // .txt
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de archivo no válido. Solo se permiten PDF, DOCX y TXT.'), false);
  }
};

const upload = multer({
  storage,
  limits,
  fileFilter,
});

module.exports = upload;