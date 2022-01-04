import optionModel from '../models/option.model';

let options = {};

/**
 * @param {string} key
 * @returns {Promise<string|null>}
 */

export const getOption = async (key) => {
  // console.log(options);
  if (options[key]) {
    return options[key];
  }
  const option = await optionModel.findOne({ name: key }).lean();
  if (!option) {
    return null;
  }
  if (option.cachable) {
    options[key] = option.value;
  }
  return option.value;
};

/**
 * @param {string} key
 * @param {string} value
 * @param {object} options
 * @returns {Promise<string>}
 */

export const setOption = async (key, value, ops = { cachable: true }) => {
  if (ops.cachable) {
    options[key] = value;
  }
  await optionModel.updateOne(
    { name: key },
    { value, cachable: options.cachable },
    { upsert: true },
  );
  return value;
};
