var gulp = require("gulp"),
    browsersync = require("browser-sync").create(),
    packageJson = require('./package.json'),
    autoprefixer = require("gulp-autoprefixer"),
    babel = require("gulp-babel"),
    uglify = require("gulp-uglify"),
    concat = require("gulp-concat"),
    pug = require("gulp-pug"),
    sass = require("gulp-sass"),
    mincss = require("gulp-clean-css"),
    sourcemaps = require("gulp-sourcemaps"),
    rename = require("gulp-rename"),
    favicons = require("gulp-favicons"),
    replace = require("gulp-replace"),
    newer = require("gulp-newer"),
    plumber = require("gulp-plumber"),
    debug = require("gulp-debug"),
    watch = require("gulp-watch"),
    clean = require("gulp-clean"),
    webpack = require('webpack'),
    webpackStream = require('webpack-stream'),
    rsync = require('gulp-rsync');

gulp.task("clean", function () {
    return gulp.src("./dest/*", {
            read: false
        })
        .pipe(clean())
        .pipe(debug({
            "title": "clean"
        }));
});
gulp.task("favicons", function() {
    return gulp.src("./src/img/favicons/*.{jpg,jpeg,png,gif}")
        .pipe(favicons({
            icons: {
                appleIcon: true,
                favicons: true,
                online: false,
                appleStartup: false,
                android: false,
                firefox: false,
                yandex: false,
                windows: false,
                coast: false
            }
        }))
        .pipe(gulp.dest("./dest/img/favicons/"))
        .pipe(debug({"title": "favicons"}));
});
gulp.task("images", function() {
    return gulp.src(["./src/img/**/*.{jpg,jpeg,png,gif}", "!./src/img/svg/icons/*", "!./src/img/favicons/*.{jpg,jpeg,png,gif}"])
        .pipe(newer("./dest/img/"))
        .pipe(gulp.dest("./dest/img/"))
        .pipe(debug({"title": "images"}))
        .on("end", browsersync.reload);
});
gulp.task("libs", function () {
    return gulp.src("./src/libs/**/*.js")
        .pipe(sourcemaps.init())
        .pipe(babel({presets: ["@babel/preset-env"]}))
        .pipe(concat("libs.js"))
        .pipe(uglify())
        .pipe(rename({suffix: ".min"}))
        .pipe(sourcemaps.write("./maps/"))
        .pipe(gulp.dest("./dest/js/"))
        .pipe(debug({"title": "scripts"}))
        .on("end", browsersync.reload);
});
gulp.task("pug", function() {
    return gulp.src(["./src/views/**/*.pug", "!./src/views/blocks/*.pug"])
        .pipe(pug({pretty: true}))
        .pipe(replace("../dest/", "../"))
        .pipe(gulp.dest("./dest/"))
        .pipe(debug({"title": "html"}))
        .on("end", browsersync.reload);
});
gulp.task("scripts", function () {
    return gulp.src("./src/js/app.js")
        .pipe(sourcemaps.init())
        .pipe(webpackStream({
            output: {
            filename: 'app.js',
            },
            module: {
            rules: [
                {
                test: /\.(js)$/,
                exclude: /(node_modules)/,
                loader: 'babel-loader',
                query: {
                    presets: ['env']
                }
                }
            ]
            },
            externals: {
            jquery: 'jQuery'
            }
        }))
        .pipe(uglify())
        .pipe(rename({suffix: ".min"}))
        .pipe(sourcemaps.write("./maps/"))
        .pipe(gulp.dest("./dest/js/"))
        .pipe(debug({"title": "scripts"}))
        .on("end", browsersync.reload);
});
gulp.task("serve", function () {
    return new Promise((res, rej) => {
        browsersync.init({
            server: "./dest/",
            tunnel: false,
            port: 9000
        });
        res();
    });
});
gulp.task("server_conf", function() {
    return gulp.src(["./src/.htaccess", "./src/.htpasswd"])
        .pipe(gulp.dest("./dest/"));
});
gulp.task("styles", function() {
    return gulp.src(["./src/styles/**/*.scss", "!./src/vendor/**/*.css"])
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(autoprefixer({overrideBrowserslist: ["last 12 versions", "> 1%"]}))
        .pipe(mincss({compatibility: "ie8", level: {1: {specialComments: 0}}}))
        .pipe(rename({suffix: ".min"}))
        .pipe(replace("../../dest/", "../"))
        .pipe(plumber.stop())
        .pipe(sourcemaps.write("./maps/"))
        .pipe(gulp.dest("./dest/styles/"))
        .pipe(debug({"title": "styles"}))
        .on("end", browsersync.reload);
});
//exports
gulp.task("svg", function() {
    return gulp.src("./src/img/**/*.svg")
        .pipe(gulp.dest("./dest/img/"))
        .on("end", browsersync.reload);
});
gulp.task("php", function() {
  return gulp.src("./src/*.php")
      .pipe(gulp.dest("./dest/"))
      .on("end", browsersync.reload);
});
gulp.task("video", function() {
  return gulp.src("./src/videos/*")
      .pipe(gulp.dest("./dest/videos/"))
      .on("end", browsersync.reload);
});
gulp.task("fonts", function() {
  return gulp.src("./src/fonts/**/*")
      .pipe(gulp.dest("./dest/fonts/"))
      .on("end", browsersync.reload);
});
gulp.task("watch", function() {
    return new Promise((res, rej) => {
        watch("./src/views/**/*.pug", gulp.series("pug"));
        watch("./src/styles/**/*.scss", gulp.series("styles"));
        watch(["./src/img/**/*.{jpg,jpeg,png,gif}", "!./src/img/icons/svg/*.svg", "!./src/img/favicons/*.{jpg,jpeg,png,gif}"], gulp.series("images"));
        watch("./src/img/**/*.svg", gulp.series("svg"));
        watch("./src/fonts/**/*", gulp.series("fonts"));
        watch("./src/*.php", gulp.series("php"));
        watch("./src/video/*", gulp.series("video"));
        watch("./src/js/**/*.js", gulp.series("scripts"));
        watch("./src/libs/**/*", gulp.series("libs"));
        res();
    });
});

// BUILD
gulp.task("default", gulp.series("clean", "libs",
    gulp.parallel("pug", "styles", "favicons", "fonts", "video", "php", "images", "svg", "scripts", "server_conf"),
    gulp.parallel("watch", "serve")
));

//deploy
gulp.task("deploy", function () {
    return gulp.src('./dest/**')
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