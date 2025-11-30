const jwt = require('jsonwebtoken');
const verifyToken = require('../middlewares/verifyToken');

process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret-key';

describe('Auth Middleware - verifyToken', () => {

  const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  const nextFunction = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería devolver 401 si no se proporciona un token', async () => {
    const req = { headers: {} };
    const res = mockResponse();

    await verifyToken(req, res, nextFunction);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ mensaje: 'Acceso denegado. Token no proporcionado o con formato incorrecto.' });
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('debería devolver 401 si el token es inválido o malformado', async () => {
    const req = { headers: { authorization: 'Bearer token-invalido' } };
    const res = mockResponse();

    await verifyToken(req, res, nextFunction);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ mensaje: 'Token inválido o expirado.' });
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('debería adjuntar los datos del usuario a la \'req\' y llamar a next() si el token es válido', async () => {
    const userData = { id: 'testUserId', nombre: 'Test User' };
    const validToken = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '1h' });

    const req = { headers: { authorization: `Bearer ${validToken}` } };
    const res = mockResponse();

    await verifyToken(req, res, nextFunction);

    expect(req.user).toBeDefined();
    expect(req.user.id).toBe(userData.id);
    expect(nextFunction).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

});