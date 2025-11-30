const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  // El estándar es enviar el token en el header 'Authorization' con el formato "Bearer TOKEN".
  const authHeader = req.headers['authorization'];

  // 1. Verificamos si el header 'authorization' existe y si empieza con 'Bearer '
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ mensaje: 'Acceso denegado. Token no proporcionado o con formato incorrecto.' });
  }

  // 2. Extraemos el token, eliminando la parte "Bearer " del string.
  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ mensaje: 'Token malformado o ausente.' });
  }

  try {
    // 3. Verificamos el token usando la clave secreta de las variables de entorno (.env)
    const secret = process.env.JWT_SECRET || 'secret'; // Usamos un fallback por si acaso
    const decoded = jwt.verify(token, secret);
    
    // 4. CORRECCIÓN: Adjuntamos el ID del usuario (decodificado del token) al objeto `request`.
    req.userId = decoded.id; // Antes decía req.user = decoded
    
    next(); // El token es válido, continuamos hacia el controlador.

  } catch (error) {
    // Si jwt.verify falla (token expirado, firma inválida, etc.)
    res.status(401).json({ mensaje: 'Token inválido o expirado.' });
  }
};

module.exports = verifyToken;