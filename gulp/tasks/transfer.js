module.exports = function() {
  $.gulp.task("svg", function() {
      return $.gulp.src("./src/img/**/*.svg")
          .pipe($.gulp.dest("./dest/img/"))
          .on("end", $.browsersync.reload);
  });
  $.gulp.task("php", function() {
    return $.gulp.src("./src/*.php")
        .pipe($.gulp.dest("./dest/"))
        .on("end", $.browsersync.reload);
  });
  $.gulp.task("fonts", function() {
    return $.gulp.src("./src/fonts/**/*")
        .pipe($.gulp.dest("./dest/fonts/"))
        .on("end", $.browsersync.reload);
});
};