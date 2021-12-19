import Handlebars from 'handlebars';

const handlebarsHelpers = {};

handlebarsHelpers.errorInput = function (errors, type) {
  if (typeof errors !== 'object') return;
  const keys = Object.keys(errors);
  if (keys.indexOf(type) > -1) return 'is-invalid';
};

handlebarsHelpers.errorMessage = function (errors, type) {
  if (typeof errors !== 'object') return '';
  const keys = Object.keys(errors);
  if (keys.indexOf(type) > -1) {
    return new Handlebars.SafeString(
      `<div class="invalid-feedback">${Handlebars.escapeExpression(
        errors[type],
      )}</div>`,
    );
  }
};

handlebarsHelpers.activeClass = function (path, currentPath) {
  if (path === currentPath) return 'active';
};

export default handlebarsHelpers;
