module.exports = function() {
  $.gulp.task("deploy", function() {
    return $.gulp.src('./dest/')
    .pipe(rsync({
      root: './dest/',
      hostname: 'test.artica.art',
      destination: 'www/test.artica.art/',
      archive: true,
      silent: false,
      compress: true
    }));
  });
};