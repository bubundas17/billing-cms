module.exports = {
  init(funcs) {
    // Runs on theme load to initialize the theme.
    console.log('Theme initialized.');
  },
};

layouts = {
  default: "layouts/default.hbs",
  overrids: [{
    template: "index",
    "layout": "layouts/index.hbs",
  }]
}