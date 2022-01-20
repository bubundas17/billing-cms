import optionModel from '@models/option.model';

const options = {};

function getKeyValue(key) {
  let keyvalue = '';
  if (typeof key === 'object') {
    keyvalue = key.name.toLowerCase();
  } else {
    keyvalue = key.toLowerCase();
  }
  if (!keyvalue) throw new Error('Invalid key');
  return keyvalue;
}

/**
 * @param {string} key
 * @returns {Promise<string|null>}
 */
export const getOption = async (key) => {
  let keyvalue = getKeyValue(key);
  console.log(keyvalue);

  if (options[keyvalue]) {
    return options[keyvalue];
  }
  const option = await optionModel.findOne({ name: keyvalue }).lean();
  if (!option) {
    if (typeof key === 'object') {
      options[keyvalue] = key.defaultValue;
      return key.defaultValue;
    }
    return null;
  }
  if (option.cachable) {
    options[keyvalue] = option.value;
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
  let keyvalue = getKeyValue(key);

  if (ops.cachable) {
    options[keyvalue] = value;
  }
  await optionModel.updateOne(
    { name: keyvalue },
    { value, cachable: options.cachable },
    { upsert: true },
  );
  return value;
};

/**
 * @description Delete option
 *
 * @param {string} key
 * @returns {Promise<boolean>}
 */
export const deleteOption = async (key) => {
  let keyvalue = getKeyValue(key);
  try {
    await optionModel.deleteOne({ name: keyvalue });
    return true;
  } catch (_) {
    return false;
  }
};
