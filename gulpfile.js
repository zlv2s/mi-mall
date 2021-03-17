const { series, src, dest, watch, parallel } = require('gulp')
const sass = require('gulp-sass')
const cssnano = require('cssnano')
const postcss = require('gulp-postcss')
const rename = require('gulp-rename')
const autoprefixer = require('autoprefixer')
const babel = require('gulp-babel')
const uglify = require('gulp-uglify')
const connect = require('gulp-connect')
const del = require('del')

// 删除文件和文件夹
function delFn() {
  return del('./dist')
}
// 编译 scss
function compileScss() {
  return src('./src/scss/*.scss')
    .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
    .pipe(dest('./src/css'))
}

function css() {
  const plugins = [autoprefixer(), cssnano()]
  return (
    src('./src/css/*.css')
      .pipe(postcss(plugins))
      // .pipe(rename({ suffix: '.min' }))
      .pipe(dest('./dist/css'))
  )
}

// 编译ES6
function compileJS() {
  return src('./src/js/*.js')
    .pipe(
      babel({
        presets: ['@babel/env']
      })
    )
    .pipe(dest('./dist/js'))
}

// 压缩JS代码
function uglifyJs() {
  return (
    src('./dist/js/*.js', { allowEmpty: true })
      .pipe(uglify())
      // .pipe(rename({ suffix: '.min' }))
      .pipe(dest('./dist/js'))
  )
}

// 添加浏览器前缀
// function autoprefixerFn() {
//   return src('./dist/css/*.css').pipe(autoprefixer()).pipe(dest('./dist/css'))
// }

// 压缩css文件
// function cleanCssFn() {
//   return src('./dist/css/*.css')
//     .pipe(
//       cleanCss({
//         compatibility: 'ie8'
//       })
//     )
//     .pipe(rename({ suffix: '.min' }))
//     .pipe(dest('./dist/css'))
// }

// 复制 lib 文件
function copyLibFile() {
  return src('./src/lib/**/*').pipe(dest('./dist/lib'))
}

// 复制 html 文件
function copyHtmlFile() {
  return src('./src/*.html').pipe(dest('./dist'))
}

// 复制 image 文件
function copyImgFile() {
  return src('./src/images/**/*').pipe(dest('./dist/images'))
}

// 复制 image 文件
function copyUtilsFile() {
  return src('./src/utils/**/*').pipe(dest('./dist/utils'))
}

// 本地服务器
function devServer() {
  return connect.server({
    root: 'dist/',
    port: 8999,
    host: '0.0.0.0',
    livereload: true
  })
}

function serverReload() {
  return src([
    './src/*.html',
    './src/js/*.js',
    './utils/*.js',
    './src/scss/*.scss'
  ]).pipe(connect.reload())
}

function watchFiles() {
  watch('./src/scss/*.scss', series(compileScss, css, serverReload))
  watch('./src/css/*.css', series(css, serverReload))
  watch('./src/js/*.js', series(compileJS, uglifyJs, serverReload))
  watch('./src/images/**/*', series(copyImgFile, serverReload))
  watch('./src/*.html', series(copyHtmlFile, serverReload))
  watch('./src/utils/*.js', series(copyUtilsFile, serverReload))
}

function defaultTask() {
  setTimeout(watchFiles)
  return series(
    delFn,
    parallel(
      copyHtmlFile,
      copyImgFile,
      copyLibFile,
      copyUtilsFile,
      series(compileJS, uglifyJs),
      series(compileScss, css),
      devServer
    )
  )
}

exports.default = defaultTask()
exports.watch = watchFiles
