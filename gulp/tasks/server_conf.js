module.exports = function() {
	$.gulp.task("server_conf", function() {
		return $.gulp.src(["./src/.htaccess", "./src/.htpasswd"])
			.pipe($.gulp.dest("./dest/"));
	});
};