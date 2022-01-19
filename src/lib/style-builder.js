import DirScanner from '@utils/directory-scanner';
import { buildStyles } from '../../gulpfile.babel.js';
import { join } from 'path';
import { statSync } from 'fs';
let building = false;
let lastmod = 0;

export const watchBuilding = function watchBuilding(next) {
  if (!building) return next();
  let interval = setInterval(() => {
    if (!building) {
      next();
      clearInterval(interval);
    }
  }, 100);
};

export const build = function build() {
  let updateNeeded = false;
  let files = DirScanner(join(__dirname, '../', '**/*{.hbs,.scss}'));
  // console.log(files);
  for (let file of files) {
    let mtime = statSync(file).mtime.getTime();
    if (mtime > lastmod) {
      lastmod = mtime;
      updateNeeded = true;
    }
  }
  if (!updateNeeded) return;
  if (building) return;
  building = true;
  buildStyles(() => {
    building = false;
  });
};
