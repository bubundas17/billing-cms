import Handlebars from 'handlebars';

const handlebarsHelpers: Record<string, unknown> = {};

// Returns form input invalid class if form input not valid
handlebarsHelpers.errorInput = function (
  errors: object,
  type: string,
): string | undefined {
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
  errors: Record<string, string>,
  type: string,
): string | Handlebars.SafeString | undefined | void {
  if (typeof errors !== 'object') return '';
  const keys = Object.keys(errors);

  if (keys.indexOf(type) > -1) {
    return new Handlebars.SafeString(
      `<div class="invalid-feedback" style="display: block !important;">${Handlebars.escapeExpression(
        errors[type],
      )}</div>`,
    );
  }
};

// Returns active class if path is equal to current path
handlebarsHelpers.activeClass = function (
  path: string,
  currentPath: string,
): string | void {
  if (path === currentPath) return 'active';
};

handlebarsHelpers.json = function (context: object) {
  if (!context) return '{}';
  return JSON.stringify(context);
};

handlebarsHelpers.equal = function (value: string, other: string): boolean {
  return value === other;
};

handlebarsHelpers.select = function (
  selected: string,
  options: { fn: (arg0: Record<string, unknown>) => string },
) {
  return options
    .fn(this)
    .replace(new RegExp(' value="' + selected + '"'), '$& selected="selected"');
};

export default handlebarsHelpers;
