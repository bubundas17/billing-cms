const sass = require('sass');
const fs = require('fs');
const path = require('path');

module.exports = {
  init(funcs) {
    // Runs on theme load to initialize the theme.
    console.log('Theme initialized.');
    // watch public/scss/theme.scss and compile it to public/css/theme.css
    fs.watch(path.join(__dirname, 'assets/scss/style.scss'), (eventType, filename) => {
      if (eventType === 'change') {
        sass.render({
          file: path.join(__dirname, 'assets/scss/style.scss'),
          outputStyle: 'compressed',
        }, (err, result) => {
          if (err) {
            console.log(err);
          } else {
            fs.writeFile(path.join(__dirname, 'public/assets/css/style.css'), result.css, (err) => {
              if (err) {
                console.log(err);
              } else {
                console.log('style.css updated.');
              }
            });
          }
        });
      }
    });
  },
};

layouts = {
  default: "layouts/default.hbs",
  overrids: [{
    template: "index",
    "layout": "layouts/index.hbs",
  }]
}