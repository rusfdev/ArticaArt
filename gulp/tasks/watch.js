module.exports = function() {
    $.gulp.task("watch", function() {
        return new Promise((res, rej) => {
            $.watch("./src/views/**/*.pug", $.gulp.series("pug"));
            $.watch("./src/styles/**/*.scss", $.gulp.series("styles"));
            $.watch(["./src/img/**/*.{jpg,jpeg,png,gif}", "!./src/img/icons/svg/*.svg", "!./src/img/favicons/*.{jpg,jpeg,png,gif}"], $.gulp.series("images"));
            $.watch("./src/img/**/*.svg", $.gulp.series("svg"));
            $.watch("./src/fonts/**/*", $.gulp.series("fonts"));
            $.watch("./src/*.php", $.gulp.series("php"));
            $.watch("./src/js/**/*.js", $.gulp.series("scripts"));
            $.watch("./src/libs/**/*", $.gulp.series("libs"));
            res();
        });
    });
};