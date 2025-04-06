export function authorizeRoles(...allowedRoles) {
    return (req, res, next) => {
      // Asegurarnos de que venga el usuario (ya autenticado con Passport)
      if (!req.user || !req.user.role) {
        return res.status(401).json({ message: 'No autenticado' });
      }
  
      // Comprobar si su rol está en la lista de permitidos
      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ message: 'No tienes permisos para esta acción' });
      }

      next();
    }
  }