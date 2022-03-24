import { Request, Response } from 'express';
export const getCart = async (_req: Request, res: Response) => {
  res.load('cart/index', {
    title: 'Cart',
  });
};

export const getCartConfigration = (_req: Request, res: Response) => {
  res.load('cart/configuration', {
    title: 'Cart Configuration',
  });
};
