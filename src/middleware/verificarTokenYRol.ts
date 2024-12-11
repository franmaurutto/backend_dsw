import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const verificarTokenYRol = (rolesPermitidos: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Obtener el token del header Authorization
    const token = req.header('Authorization')?.split(' ')[1]; // "Bearer token"

    if (!token) {
      return res.status(401).json({ message: 'Token no proporcionado' });
    }

    // Verificar el token
    jwt.verify(token, process.env.JWT_SECRET || 'clave_secreta', (err, decoded: any) => {
      if (err) {
        console.log('Error al verificar token:', err.message);
        return res.status(401).json({ message: 'Token inválido' });
      }

      // Verificar el rol
      const rol = decoded.rol;
      if (!rolesPermitidos.includes(rol)) {
        console.log('Acceso denegado: rol no autorizado', rol);
        return res.status(403).json({ message: 'Acceso denegado: rol no autorizado' });
      }

      // Añadir los datos del usuario al request
      req.id = decoded.id;
      req.rol = decoded.rol;  // Guardar el rol para uso posterior

      next();  // El usuario tiene acceso
    });
  };
};

export { verificarTokenYRol };
