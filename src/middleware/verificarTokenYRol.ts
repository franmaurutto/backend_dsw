import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const verificarTokenYRol = (rolesPermitidos: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {

    const token = req.header('Authorization')?.split(' ')[1]; 

    if (!token) {
      return res.status(401).json({ message: 'Token no proporcionado' });
    }

  
    jwt.verify(token, process.env.JWT_SECRET || 'clave_secreta', (err, decoded: any) => {
      if (err) {
        console.log('Error al verificar token:', err.message);
        return res.status(401).json({ message: 'Token inválido' });
      }

   
      const rol = decoded.rol;
      if (!rolesPermitidos.includes(rol)) {
        console.log('Acceso denegado: rol no autorizado', rol);
        return res.status(403).json({ message: 'Acceso denegado: rol no autorizado' });
      }

    
      req.id = decoded.id;
      req.rol = decoded.rol; 

      next();  
    });
  };
};

export { verificarTokenYRol };
