import { getProfile } from '@controllers/clientarea/profile.controller';
import BaseRoute from '@routes/base.route';

class Profile extends BaseRoute {
  constructor() {
    super('/clientarea');
    this.init();
  }

  init() {
    // TODO - initialize
    this.router.route('/profile').get(getProfile);
  }
}

export default Profile;
