const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const rateLimit = require('express-rate-limit');

// Rate limit para subir audio (max 10 por 15 minutos)
const audioLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: 'Demasiadas grabaciones. Intente más tarde.'
  }
});

// Crear directorio de uploads si no existe
const uploadDir = path.join(__dirname, '../../uploads/audio');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configurar multer para almacenar los archivos de audio
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generar nombre de archivo único: audio-162983712.webm
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    // Extracción de extensión segura
    let ext = '.webm';
    if (file.mimetype === 'audio/mpeg' || file.mimetype === 'audio/mp3') ext = '.mp3';
    if (file.mimetype === 'audio/wav') ext = '.wav';
    
    cb(null, 'audio-' + uniqueSuffix + ext);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB máximo (muy poco espacio)
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('audio/')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos de audio'));
    }
  }
});

// Ruta POST para subir audio
router.post('/upload', audioLimiter, (req, res, next) => {
  upload.single('audio')(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ success: false, message: 'El archivo de audio es demasiado grande (Máx 2MB)' });
      }
      return res.status(400).json({ success: false, message: 'Error al subir el archivo' });
    } else if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    next();
  });
}, (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No se proporcionó ningún archivo de audio'
      });
    }

    // Devolver la ruta donde quedó guardado
    const fileUrl = `/uploads/audio/${req.file.filename}`;
    
    res.status(201).json({
      success: true,
      message: 'Audio subido correctamente',
      data: {
        url: fileUrl,
        filename: req.file.filename,
        size: req.file.size
      }
    });
  } catch (error) {
    console.error('Error al subir audio:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno al procesar el audio'
    });
  }
});

module.exports = router;
