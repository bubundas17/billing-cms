import Handlebars from 'handlebars';

const handlebarsHelpers = {};

/**
 * @description Returns form input invalid class
 *
 * @param {object} errors
 * @param {string} type
 * @returns {string}
 */
handlebarsHelpers.errorInput = function (errors, type) {
  if (typeof errors !== 'object') return;
  const keys = Object.keys(errors);
  if (keys.indexOf(type) > -1) {
    return 'is-invalid';
  } else {
    return 'border-gray-200';
  }
};

/**
 * @description Returns form input error message if form input not valid
 *
 * @param {object} errors
 * @param {string} type
 * @returns {Handlebars.SafeString}
 */
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

/**
 * @description Returns active class if path is equal to current path
 *
 * @param {string} path
 * @param {string} currentPath
 * @returns {string}
 */
handlebarsHelpers.activeClass = function (path, currentPath) {
  if (path === currentPath) return 'active';
};

export default handlebarsHelpers;
