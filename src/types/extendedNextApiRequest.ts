import { NextApiRequest } from 'next';

export interface ExtendedNextApiRequest extends NextApiRequest {
  user: {
    _json: {

    };
    id: string;
    displayName: string;
  } | any;
} 