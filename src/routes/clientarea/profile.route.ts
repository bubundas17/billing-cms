import {
  getEmailHistory,
  getProfile,
} from '@controllers/clientarea/profile.controller';
import BaseRoute from '@routes/base.route';

class Profile extends BaseRoute {
  constructor() {
    super('/clientarea');
    this.init();
  }

  init() {
    // TODO - initialize
    this.router.route('/profile').get(getProfile);
    this.router.route('/email-history').get(getEmailHistory);
  }
}

export default Profile;
