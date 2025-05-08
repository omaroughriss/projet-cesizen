import { JwtPayload } from './jwt-payload.type';
import { Request } from 'express';

export interface RequestWithUser extends Request {
  user: JwtPayload;
}
