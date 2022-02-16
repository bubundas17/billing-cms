import optionModel from '@models/option.model';

const options: {
  [key: string]: unknown;
} = {};

function getKeyValue(key: string | { [key: string]: unknown }) {
  let keyvalue = '';
  if (typeof key === 'object') {
    keyvalue = String(key.name).toLowerCase();
  } else {
    keyvalue = key.toLowerCase();
  }
  if (!keyvalue) throw new Error('Invalid key');
  return keyvalue;
}

export const getOption = async (key: string | { [key: string]: unknown }) => {
  const keyvalue = getKeyValue(key);

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

export const setOption = async (
  key: string | { [key: string]: string },
  value: string,
  ops = { cachable: true },
) => {
  const keyvalue = getKeyValue(key);

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

export const deleteOption = async (
  key: string | { [key: string]: unknown },
) => {
  const keyvalue = getKeyValue(key);

  try {
    await optionModel.deleteOne({ name: keyvalue });
    return true;
  } catch (_) {
    return false;
  }
};
