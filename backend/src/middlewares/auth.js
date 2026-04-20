import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'keXNwLSmrkbLQ74xF7O2VYr0ezKWvU2QXZ5DZyB682uJaj8Hz5N5zqA2Ge3y4Day564LPWRhlKbWd0c40aCFAQ==';

export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Não autorizado' });
  }

  const token = authHeader.replace('Bearer ', '');
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido' });
  }
}

export function authorize(roles = []) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Não autorizado' });
    }

    if (roles.length > 0 && !roles.includes(req.user.papel)) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    next();
  };
}

export default authMiddleware;