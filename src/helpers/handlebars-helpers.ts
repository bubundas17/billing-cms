import Handlebars from 'handlebars';

const handlebarsHelpers: Record<string, unknown> = {};

// Returns form input invalid class if form input not valid
handlebarsHelpers.errorInput = function (errors: object, type: string): string {
  if (typeof errors !== 'object') return;
  const keys = Object.keys(errors);
  if (keys.indexOf(type) > -1) {
    return 'is-invalid';
  } else {
    return 'border-gray-200';
  }
};

// Returns form input error message if form input not valid
handlebarsHelpers.errorMessage = function (
  errors: object,
  type: string,
): string | Handlebars.SafeString {
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

// Returns active class if path is equal to current path
handlebarsHelpers.activeClass = function (
  path: string,
  currentPath: string,
): string | undefined {
  if (path === currentPath) return 'active';
};

export default handlebarsHelpers;
