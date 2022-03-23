import { Request, Response } from 'express';
export const getCart = async (_req: Request, res: Response) => {
  res.load('cart/index', {
    title: 'Cart',
  });
};
