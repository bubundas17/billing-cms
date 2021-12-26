export default (errors) =>
  errors.reduce((acc, curr) => {
    acc[curr.param] = curr.msg;
    return acc;
  }, {});
