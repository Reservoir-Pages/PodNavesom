// Gulp
const { src, dest, series, watch }  = require('gulp'); // подключаем функции gulp
const gulpif                        = require('gulp-if'); // условие если
const nodePath                      = require('path'); // получение названия папки проекта
// Удаление
const del                           = require('del'); // подключаем, ранее установленную библиотеку del(для удаления директорий и файлов)
// Создание спрайта
const svgSprite                     = require('gulp-svg-sprite'); // подключаем, ранее установленную библиотеку создания SVG-спрайтов из svg
const svgmin                        = require('gulp-svgmin');
const cheerio                       = require('gulp-cheerio');
const replace                       = require('gulp-replace'); // поиск и замена
// Работа с HTML
const fileInclude                   = require('gulp-file-include');
const typograf                      = require('gulp-typograf');
const htmlMin                       = require('gulp-htmlmin'); // подключаем, ранее установленную библиотеку минификации html
var version                         = require('gulp-version-number');
// Работа с CSS/SCSS
const sass                          = require('gulp-sass')(require('sass'));
const autoprefixer                  = require('gulp-autoprefixer'); // подключаем, ранее установленную библиотеку autoprefixer
const cleanCSS                      = require('gulp-clean-css'); // подключаем, ранее установленную библиотеку clean-css
// Работа с JS
const webpack                       = require('webpack');
const webpackStream                 = require('webpack-stream');
const uglify                        = require('gulp-uglify-es').default; // для обфускации кода(делает код не читаемым)
// Создание карт файлов
const sourcemaps                    = require('gulp-sourcemaps'); // работа с sourcemaps
// Обработка ошибок
const plumber                       = require('gulp-plumber'); // обработка ошибок
const notify                        = require('gulp-notify'); // показывает ошибки и подсказки сборки
// Обновление страницы
const browserSync                   = require('browser-sync').create() // подключаем, ранее установленную библиотеку browser-sync, как гласит спека добавляем .create()
// Шрифты
const ttf2woff                      = require('gulp-ttf2woff');
const ttf2woff2                     = require('gulp-ttf2woff2');
// Изображения
const image                         = require('gulp-imagemin'); // подключаем, ранее установленную библиотеку оптимизации изображений // version 6.3.1 no work need to setup 6.2.1
const webp                          = require('gulp-webp');
// Deploy
const ftp                           = require('vinyl-ftp');
const gutil                         = require('gulp-util');
const fs              = require('fs');
// Zip
const zip                           = require('gulp-zip');
// Path
// const ftpNameFolder = './Bytes-rights/public_html';
// const ftpNameFolder = nodePath.basename(nodePath.resolve()); // ceramics-gulp
const srcFolder = './src';
const distFolder = './dist';
const buildFolder = './build';
const distJSFile = 'main.js';

const paths = {
  srcHtml:            `${srcFolder}/*.html`,
  srcSvg:             `${srcFolder}/svg/**/*.svg`,
  srcScss:            `${srcFolder}/styles/**/*.scss`,
  srcJs:              `${srcFolder}/scripts/**/*.js`,
  srcJsMain:          `${srcFolder}/scripts/**/main.js`,
  srcJsVendor:        `${srcFolder}/scripts/vendor/**/*.js`,
  srcImages:          `${srcFolder}/images/**/**.{jpg,jpeg,png,svg}`,
  srcStylesFolder:    `${srcFolder}/styles`,
  srcImgFolder:       `${srcFolder}/images`,
  // srcPartialsFolder:  `${srcFolder}/partials`,
  srcResourcesFolder: `${srcFolder}/resources/**`,

  distFonts:          `${distFolder}/fonts`,
  distImgFolder:      `${distFolder}/images`,
  distCssFolder:      `${distFolder}/styles`,
  distJsFolder:       `${distFolder}/scripts`,

  buildFonts:         `${buildFolder}/fonts`,
  buildImgFolder:     `${buildFolder}/images`,
  buildCssFolder:     `${buildFolder}/styles`,
  buildJsFolder:      `${buildFolder}/scripts`,
};
let isProd = false; // dev by default

// DEV //
const cleanDev = () => {
  return del(distFolder)
};
const resourcesDev = () => {
  return src(paths.srcResourcesFolder)
  .pipe(dest(distFolder))
};
const fontsTtfToWoffDev = () => {
  src([`${paths.srcResourcesFolder}/**/*.ttf`])
  .pipe(plumber(notify.onError({
    title: "FONTS",
    message: "Error: <%= error.message %>"
  })))
  .pipe(ttf2woff())
  .pipe(dest(distFolder))
  return src([`${paths.srcResourcesFolder}/**/*.ttf`])
  .pipe(ttf2woff2())
  .pipe(dest(distFolder))
}
const imagesDev = () => {
  return src(paths.srcImages)
  .pipe(plumber(notify.onError({
    title: "IMAGES",
    message: "Error: <%= error.message %>"
  })))
  .pipe(gulpif(isProd, image([
    image.mozjpeg({
      quality: 80,
      progressive: true
    }),
    image.optipng({
      optimizationLevel: 2
    }),
  ])))
  .pipe(dest(paths.distImgFolder))
};
const webpImagesDev = () => {
  return src(paths.srcImages)
    .pipe(webp())
    .pipe(dest(paths.distImgFolder))
};
const svgSpritesDev = () => {
  return src(paths.srcSvg)
    .pipe(
      svgmin({
        js2svg: {
          pretty: true,
        },
      })
    )
    .pipe(
      cheerio({
        run: function ($) {
          // $('[fill]').removeAttr('fill');
          // $('[stroke]').removeAttr('stroke');
          // $('[style]').removeAttr('style');
        },
        parserOptions: {
          xmlMode: true
        },
      })
    )
    .pipe(replace('&gt;', '>'))
    .pipe(svgSprite({
      mode: {
        stack: {
          sprite: "../sprite.svg"
        }
      },
    }))
    .pipe(dest(paths.distImgFolder));
}
const stylesDev = () => {
  return src(paths.srcScss)
  .pipe(plumber(notify.onError({
    title:"SCSS",
    message: "Error: <%= error.message %>"
  })))
  .pipe(gulpif(!isProd, sourcemaps.init()))
  .pipe(sass({
    outputStyle: 'compressed'
  }).on('error', sass.logError))
  .pipe(autoprefixer({
    cascade: false,
    grid: true,
    overrideBrowserslist: ["last 5 versions"]
  }))
  .pipe(gulpif(isProd, cleanCSS({ level: 2 })))
  .pipe(gulpif(!isProd, sourcemaps.write('sourcemaps/')))
  .pipe(dest(paths.distCssFolder))
  .pipe(browserSync.stream())
}
// ???
const scriptsDev = () => {
  return src(paths.srcJsMain)
    .pipe(plumber(notify.onError({
      title: "JS",
      message: "Error: <%= error.message %>"
    })))
    .pipe(webpackStream({
      mode: isProd ? 'production' : 'development',
      output: {
        filename: distJSFile,
      },
      module: {
        rules: [{
          test: /\.m?js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', {
                  targets: "defaults"
                }]
              ]
            }
          }
        }]
      },
      devtool: !isProd ? 'source-map' : false
    }))
    .on('error', function (err) {
      console.error('WEBPACK ERROR', err);
      this.emit('end');
    })
    .pipe(dest(paths.distJsFolder))
    .pipe(browserSync.stream());
}
const htmlDev = () => {
  return src(paths.srcHtml)
    .pipe(plumber(notify.onError({
      title:"HTML",
      message: "Error: <%= error.message %>"
    })))
    .pipe(fileInclude({
      prefix: '@',
      basepath: '@file'
    }))
    .pipe(typograf({
      locale: ['ru', 'en-US']
    }))
    .pipe(dest(distFolder))
    .pipe(browserSync.stream());
}
const watchFilesDev = () => {
  browserSync.init({
    server: {
      baseDir: distFolder,
    },
  });

  watch(paths.srcResourcesFolder, resourcesDev);
  watch(paths.srcImages, imagesDev);
  watch(paths.srcImgFolder, imagesDev);
  watch(paths.srcSvg, svgSpritesDev);
  watch(paths.srcScss, stylesDev);
  watch(paths.srcJs, scriptsDev);
  watch('src/scripts/**', scriptsDev);
  watch('src/**/*.html', htmlDev);
};
exports.default = series(cleanDev, resourcesDev, fontsTtfToWoffDev, imagesDev, webpImagesDev, svgSpritesDev, stylesDev, scriptsDev, htmlDev, watchFilesDev);

// BUILD //
const cleanBuild = () => {
  return del(buildFolder)
};
const resourcesBuild = () => {
  return src(paths.srcResourcesFolder)
  .pipe(dest(buildFolder))
};
const fontsTtfToWoffBuild = () => {
  src([`${paths.srcResourcesFolder}/**/*.ttf`])
  .pipe(plumber(notify.onError({
    title: "FONTS",
    message: "Error: <%= error.message %>"
  })))
  .pipe(ttf2woff())
  .pipe(dest(buildFolder))
  return src([`${paths.srcResourcesFolder}/**/*.ttf`])
  .pipe(ttf2woff2())
  .pipe(dest(buildFolder))
}
const imagesBuild = () => {
  return src(paths.srcImages)
  .pipe(plumber(notify.onError({
    title: "IMAGES",
    message: "Error: <%= error.message %>"
  })))
  .pipe(gulpif(isProd, image([
    image.mozjpeg({
      quality: 80,
      progressive: true
    }),
    image.optipng({
      optimizationLevel: 2
    }),
  ])))
  .pipe(dest(paths.buildImgFolder))
};
const webpImagesBuild = () => {
  return src(paths.srcImages)
    .pipe(webp({
      quality: 60,
      lossless: true,
    }))
    .pipe(dest(paths.buildImgFolder))
};
const svgSpritesBuild = () => {
  return src(paths.srcSvg)
    .pipe(
      svgmin({
        js2svg: {
          pretty: true,
        },
      })
    )
    .pipe(
      cheerio({
        run: function ($) {
          // $('[fill]').removeAttr('fill');
          // $('[stroke]').removeAttr('stroke');
          // $('[style]').removeAttr('style');
        },
        parserOptions: {
          xmlMode: true
        },
      })
    )
    .pipe(replace('&gt;', '>'))
    .pipe(svgSprite({
      mode: {
        stack: {
          sprite: "../sprite.svg"
        }
      },
    }))
    .pipe(dest(paths.buildImgFolder));
}
const stylesBuild = () => {
  return src(paths.srcScss)
  .pipe(plumber(notify.onError({
    title:"SCSS",
    message: "Error: <%= error.message %>"
  })))
  .pipe(gulpif(!isProd, sourcemaps.init()))
  .pipe(sass({
    outputStyle: 'compressed'
  }).on('error', sass.logError))
  .pipe(autoprefixer({
    cascade: false,
    grid: true,
    // overrideBrowserslist: ["last 5 versions"]
  }))
  .pipe(gulpif(isProd, cleanCSS({ level: 2 })))
  .pipe(gulpif(!isProd, sourcemaps.write('sourcemaps/')))
  .pipe(dest(paths.buildCssFolder))
  .pipe(browserSync.stream())
}
// ???
const scriptsBuild = () => {
  return src(paths.srcJsMain)
    .pipe(plumber(notify.onError({
      title: "JS",
      message: "Error: <%= error.message %>"
    })))
    .pipe(webpackStream({
      mode: isProd ? 'production' : 'development',
      output: {
        filename: distJSFile,
      },
      module: {
        rules: [{
          test: /\.m?js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', {
                  targets: "defaults"
                }]
              ]
            }
          }
        }]
      },
      devtool: !isProd ? 'source-map' : false
    }))
    .pipe(uglify().on("error", notify.onError()))
    .on('error', function (err) {
      console.error('WEBPACK ERROR', err);
      this.emit('end');
    })
    .pipe(dest(paths.buildJsFolder))
    .pipe(browserSync.stream());
}
const htmlBuild = () => {
  return src(paths.srcHtml)
    .pipe(plumber(notify.onError({
      title:"HTML",
      message: "Error: <%= error.message %>"
    })))
    .pipe(fileInclude({
      prefix: '@',
      basepath: '@file'
    }))
    .pipe(typograf({
      locale: ['ru', 'en-US']
    }))
    .pipe(dest(buildFolder))
    .pipe(browserSync.stream());
}
const htmlMinifyBuild = () => {
  return src(`${buildFolder}/*.html`)
  .pipe(version({
    'value': '%DT%',
    'append': {
      'key': '_v',
      'cover': 0,
      'to': 'all',
    },
    'output': {
      'file': 'version.json'
    }
  }))
  .pipe(htmlMin({
    collapseWhitespace: true,
    removeComments: true
  }))
  .pipe(dest(buildFolder))
  .pipe(browserSync.stream())
};
const watchFilesBuild = () => {
  browserSync.init({
    server: {
      baseDir: buildFolder
    },
  });

  // watch(paths.srcResourcesFolder, series(resourcesBuild, deploy));
  watch(paths.srcResourcesFolder, resourcesBuild);
  watch(paths.srcImages, imagesBuild);
  watch(paths.srcSvg, svgSpritesBuild);
  watch(paths.srcScss, stylesBuild);
  watch(paths.srcJs, scriptsBuild);
  watch('src/scripts/**', scriptsBuild);
  watch('src/**/*.html', htmlBuild);
};
const toProd = (done) => {
  isProd = true;
  done();
};
exports.build = series(toProd, cleanBuild, resourcesBuild, fontsTtfToWoffBuild, imagesBuild, webpImagesBuild, svgSpritesBuild, stylesBuild, scriptsBuild, htmlBuild, htmlMinifyBuild, watchFilesBuild);

// BACKEND //
const stylesBackend = () => {
  return src(paths.srcScss)
    .pipe(plumber(notify.onError({
      title: "SCSS",
      message: "Error: <%= error.message %>"
    })))
    .pipe(sass())
    .pipe(autoprefixer({
      cascade: false,
      grid: true,
      overrideBrowserslist: ["last 5 versions"]
    }))
    .pipe(dest(paths.buildCssFolder))
    .pipe(browserSync.stream());
};
const scriptsBackend = () => {
  return src(paths.srcJsMain)
    .pipe(plumber(notify.onError({
      title: "JS",
      message: "Error: <%= error.message %>"
    })))
    .pipe(webpackStream({
      mode: 'development',
      output: {
        filename: 'main.js',
      },
      module: {
        rules: [{
          test: /\.m?js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', {
                  targets: "defaults"
                }]
              ]
            }
          }
        }]
      },
      devtool: false
    }))
    .on('error', function (err) {
      console.error('WEBPACK ERROR', err);
      this.emit('end');
    })
    .pipe(dest(paths.buildJsFolder))
    .pipe(browserSync.stream());
}
exports.backend = series(toProd, cleanBuild, resourcesBuild, fontsTtfToWoffBuild, imagesBuild, webpImagesBuild, svgSpritesBuild, stylesBackend, scriptsBackend, htmlBuild, watchFilesBuild);

// DEPLOY //
const deploy = () => {
  let ftpData = JSON.parse(fs.readFileSync('ftp-data.json', 'utf-8'));
  let connect = ftp.create({
    host: ftpData.host,
    user: ftpData.user,
    password: ftpData.password,
    parallel: 10,
    log: gutil.log,
  });

  return src(`${buildFolder}/**`, {})
  .pipe(plumber(notify.onError({
    title: "DEPLOY",
    message: "Error: <%= error.message %>"
  })))
  .pipe(connect.newer(ftpData.folder))
  .pipe(connect.dest(ftpData.folder));
}
exports.deploy = deploy;

// ZIP //
const zipFile = () => {
  del(`${buildFolder}.zip`);
  return src(`${buildFolder}/**`, {})
  .pipe(plumber(notify.onError({
    title: "ZIP",
    message: "Error: <%= error.message %>"
  })))
  .pipe(zip(`${buildFolder}.zip`))
  .pipe(dest('./'));
}
exports.zipFile = zipFile;


exports.cleanDev = cleanDev;
exports.resourcesDev = resourcesDev;
exports.fontsTtfToWoffDev = fontsTtfToWoffDev;
exports.imagesDev = imagesDev;
exports.webpImagesDev = webpImagesDev;
exports.svgSpritesDev = svgSpritesDev;
exports.stylesDev = stylesDev;
exports.scriptsDev = scriptsDev;
exports.htmlDev = htmlDev;
exports.htmlMinifyBuild = htmlMinifyBuild;
exports.stylesBackend = stylesBackend;
exports.scriptsBackend = scriptsBackend;
exports.toProd = toProd;
