import register from './hello';

/**
 *
 */
export default {
  name: 'Hello World Plugin',
  description: 'Hello',
  onActivate: (ctx) => {},
  register: register,
};
