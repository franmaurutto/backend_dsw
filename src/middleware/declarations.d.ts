
import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      id?: int;  // o el tipo que corresponda
      rol?: string; // o el tipo que corresponda
    }
  }
}
