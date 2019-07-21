global.$ = {
    gulp: require("gulp"),
    browsersync: require("browser-sync").create(),
    packageJson: require('./package.json'),
    autoprefixer: require("gulp-autoprefixer"),
    babel: require("gulp-babel"),
    uglify: require("gulp-uglify"),
    concat: require("gulp-concat"),
    pug: require("gulp-pug"),
    sass: require("gulp-sass"),
    mincss: require("gulp-clean-css"),
    sourcemaps: require("gulp-sourcemaps"),
    rename: require("gulp-rename"),
    imagemin: require("gulp-imagemin"),
    pngquant: require("imagemin-pngquant"),
    imageminJpegRecompress: require("imagemin-jpeg-recompress"),
    favicons: require("gulp-favicons"),
    iconfont: require("gulp-iconfont"),
    iconfontcss: require("gulp-iconfont-css"),
	svgSprite: require("gulp-svg-sprites"),
    replace: require("gulp-replace"),
    newer: require("gulp-newer"),
    plumber: require("gulp-plumber"),
    debug: require("gulp-debug"),
    watch: require("gulp-watch"),
    clean: require("gulp-clean"),

    path: {
        tasks: require("./gulp/config.js")
    }
};

$.path.tasks.forEach(function(taskPath) {
    require(taskPath)();
});

// BUILD
$.gulp.task("default", $.gulp.series("clean", "libs",
    $.gulp.parallel("pug", "styles", "favicons", "fonts", "images", "svg", "scripts", "server_conf"),
    $.gulp.parallel("watch", "serve")
));

//deploy
var rsync = require('gulp-rsync');
$.gulp.task("deploy", function() {
    return $.gulp.src('./dest/**')
    .pipe(rsync({
      root: './dest/',
      hostname: 'u0683784@37.140.192.157',
      destination: 'www/test.artica.art/',
      archive: true,
      silent: false,
      compress: true,
      exclude: ['.htpasswd', '.htaccess'],
    }));
  });