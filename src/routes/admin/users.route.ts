import {
  getClients,
  getClientProfile,
  getClientSummary,
  getEditProfile,
} from '@controllers/index';
import UserModel from '@models/user.model';
import BaseRoute from '@routes/base.route';
import { Request, Response } from 'express';

class ClientsRoute extends BaseRoute {
  constructor() {
    super('/admin/users');
    this.init();
  }

  init() {
    this.router.get('/', getClients);
    this.router.get('/profile', getClientProfile);
    this.router.get('/profile/edit/:id', getEditProfile);
    this.router.get('/search', async (req: Request, res: Response) => {
      const term = req.query.term as string;
      const regex = new RegExp(term, 'i');

      const usersSearchResult = await UserModel.find({ name: regex })
        .limit(10)
        .lean();

      let users: Array<{ id: string; label: string }> = [];
      if (
        usersSearchResult &&
        usersSearchResult.length &&
        usersSearchResult.length > 0
      ) {
        users = usersSearchResult.map((user) => {
          return {
            id: user._id,
            label: user.name,
          };
        });
      }
      return res.json(users);
    });
    this.router.get('/summary', getClientSummary);
  }
}

export default ClientsRoute;
