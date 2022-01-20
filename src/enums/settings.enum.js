const settings = {
  // Enums for settings
  SITE_TITLE: {
    name: 'site_title',
    defaultValue: 'Host Bill',
    cachable: true,
    type: String,
  },
  URL_PREFIX: {
    name: 'url_prefix',
    defaultValue: 'http://localhost:3000',
    cachable: true,
    type: String,
  },

  // Email Settings
  EMAIL_HOST: {
    name: 'email_host',
    defaultValue: 'localhost',
    cachable: true,
    type: String,
  },
  EMAIL_PORT: {
    name: 'email_port',
    defaultValue: 25,
    cachable: true,
    type: Number,
  },
  EMAIL_USERNAME: {
    name: 'email_username',
    defaultValue: '',
    cachable: true,
    type: String,
  },
  EMAIL_PASSWORD: {
    name: 'email_password',
    defaultValue: '',
    cachable: true,
    type: String,
  },
  EMAIL_FROM_ADDRESS: {
    name: 'email_from_address',
    defaultValue: '',
    cachable: true,
    type: String,
  },
  EMAIL_FROM_NAME: {
    name: 'email_from_name',
    defaultValue: '',
    cachable: true,
    type: String,
  },
  EMAIL_ENABLE_SSL: {
    name: 'email_enable_ssl',
    defaultValue: false,
    cachable: true,
    type: Boolean,
  },
  EMAIL_PROVIDER: {
    name: 'email_provider',
    defaultValue: 'smtp',
    cachable: true,
    type: String,
  },
};

Object.freeze(settings);

export default settings;
