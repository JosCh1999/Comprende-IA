const jwt = require('jsonwebtoken');
const verifyToken = require('../middlewares/verifyToken');

describe('Auth Middleware (verifyToken)', () => {
  const mockRequest = (token) => ({
    headers: {
      token: token
    },
  });

  const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  const nextFunction = jest.fn();

  // Limpiar mocks después de cada prueba
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería devolver 400 si no se proporciona un token', async () => {
    const req = mockRequest(undefined);
    const res = mockResponse();

    await verifyToken(req, res, nextFunction);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ mensaje: 'Debes enviar un token' });
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('debería devolver 400 si el token es inválido', async () => {
    const invalidToken = 'este-no-es-un-token-valido';
    const req = mockRequest(invalidToken);
    const res = mockResponse();

    await verifyToken(req, res, nextFunction);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ mensaje: 'Token invalido' });
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('debería llamar a next() si el token es válido', async () => {
    const userData = { id: '12345', rol: 'usuario' };
    // Usamos la misma clave secreta que en el middleware para generar el token
    const validToken = jwt.sign(userData, 'secreto'); 
    
    const req = mockRequest(validToken);
    const res = mockResponse();

    await verifyToken(req, res, nextFunction);

    // Verificar que next() fue llamado
    expect(nextFunction).toHaveBeenCalled();
    // Verificar que no se envió ninguna respuesta de error
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
    // Verificar que los datos del usuario se adjuntaron a req
    expect(req.user.id).toBe(userData.id);
    expect(req.user.rol).toBe(userData.rol);
  });
});
