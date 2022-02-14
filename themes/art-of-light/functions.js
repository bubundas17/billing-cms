module.exports = {
  init(funcs) {
    // JavaScript to be fired on all pages
  },
};

layouts = {
  default: "layouts/default.hbs",
  overrids: [{
    template: "index",
    "layout": "layouts/index.hbs",
  }]
}