module.exports = function () {
    $.gulp.task("libs", function () {
        return $.gulp.src("./src/libs/**/*.js")
            .pipe($.sourcemaps.init())
            .pipe($.babel({presets: ["@babel/preset-env"]}))
            .pipe($.concat("libs.js"))
            .pipe($.uglify())
            .pipe($.rename({suffix: ".min"}))
            .pipe($.sourcemaps.write("./maps/"))
            .pipe($.gulp.dest("./dest/js/"))
            .pipe($.debug({"title": "scripts"}))
            .on("end", $.browsersync.reload);
    });
};