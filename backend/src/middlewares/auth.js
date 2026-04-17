const jwt = require('jsonwebtoken');

function auth(roles = []) {
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Token nao fornecido' });
    }

    const [, token] = authHeader.split(' ');

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      // Se papéis foram especificados, verifica se o usuário tem o papel adequado
      if (roles.length && !roles.includes(req.user.papel_id)) {
          return res.status(403).json({ error: 'Acesso negado: permissao insuficiente.' });
      }

      next();
    } catch (err) {
      return res.status(401).json({ error: 'Token invalido' });
    }
  };
}

module.exports = auth;