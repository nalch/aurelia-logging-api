import {build} from 'aurelia-cli';
import gulp from 'gulp';
import project from '../aurelia.json';
import sass from 'gulp-sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import postcssUrl from 'postcss-url';

export default function processCSS() {
  return gulp.src(project.cssProcessor.source, {sourcemaps: true})
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([
      autoprefixer(),
      postcssUrl({url: 'inline', encodeType: 'base64'}),
      cssnano()
    ]))
    .pipe(build.bundle());
}

export function pluginCSS(dest) {
  return function processPluginCSS() {
    return gulp.src(project.plugin.source.css)
      .pipe(sass().on('error', sass.logError))
      .pipe(postcss([
        autoprefixer(),
        postcssUrl({url: 'inline', encodeType: 'base64'}),
        cssnano()
      ]))
      .pipe(gulp.dest(dest));
  };
}
