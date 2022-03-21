import {
  getEmailHistory,
  getProfile,
  getSecurityCenter,
  postChangePassword,
  postProfile,
} from '@controllers/clientarea/profile.controller';
import BaseRoute from '@routes/base.route';

class Profile extends BaseRoute {
  constructor() {
    super('/clientarea');
    this.init();
  }

  init() {
    // TODO - initialize
    this.router.route('/profile').get(getProfile).post(postProfile);
    this.router.route('/email-history').get(getEmailHistory);
    this.router
      .route('/security-center')
      .get(getSecurityCenter)
      .post(postChangePassword);
  }
}

export default Profile;
