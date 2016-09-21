var gulp = require('gulp');
var mainBowerFiles = require('main-bower-files');
var browserSync = require('browser-sync');
var rigger = require('gulp-rigger');
var del = require('del');

var config = {
    src: {
        main: "app/",
        js: "assets/js/",
        css: "assets/css/",
        pages: "assets/pages/"
    },
    dest: {
        main: "dist/",
        js: "assets/js/",
        css: "assets/css/",
        pages: "assets/pages/"
    }

}

gulp.task('mainfiles', function() {
    return gulp.src(mainBowerFiles())
        .pipe(gulp.dest(config.dest.main + config.dest.js))
});




// дефолтная задача, если в консоли набрать gulp и нажать [enter] - запустится именно она. Можно переопределить.
gulp.task('default', ['watch'], function() {
    console.log('По дефолту просто запускаем нашу watch');
});

gulp.task('js', function() {
    console.log('Файлы js поменялись!');
});

gulp.task('css', function() {
    console.log('Файлы css поменялись!');
});

gulp.task('html', function() {
    console.log('Файлы html поменялись!');
});


gulp.task('rigger', function() {
    gulp.src(config.src.main + config.src.js + '**/*.js')
        .pipe(rigger())
        .pipe(gulp.dest(config.dest.main + config.dest.js));

    gulp.src(config.src.main + config.src.css + '/**/*.css')
        .pipe(rigger())
        .pipe(gulp.dest(config.dest.main + config.dest.css));

    gulp.src(config.src.main + '*.html')
        .pipe(rigger())
        .pipe(gulp.dest(config.dest.main));

    gulp.src(config.src.main + config.src.pages + '/**/*.html')
        .pipe(rigger())
        .pipe(gulp.dest(config.dest.main + config.dest.pages));
});

// задача browser-sync - запуск сервера для отображения изменений в файлах в режиме онлайн (не надо рефрешить)
gulp.task('browser-sync', function() { // Создаем таск browser-sync
    browserSync({ // Выполняем browser Sync
        server: { // Определяем параметры сервера
            baseDir: config.dest.main // это каталог, из которого будут выбираться файлы для отдачи в браузер
        },
        port: 8082, // для c9.io открыты порты 8081, 8082
    });
});

// задача reload - перезапускает browser-sync для корректного отображения изменений
gulp.task('reload', ['rigger', 'mainfiles'], function() {
    browserSync.reload();
})

// задача clean - чистим dist
gulp.task('clean', function() {
    console.log("Чистим папку");
    // gulp.src(config.dest.main+config.dest.js+'*', {read: false})
    //      .pipe(clean({force: true}));
    // gulp.src(config.dest.main+config.dest.css+'*', {read: false})
    //      .pipe(clean({force: true}));
    // gulp.src(config.dest.main+'*', {read: false})
    //      .pipe(clean({force: true}));
    del.sync(config.dest.main + "**/*");
})


// в случае изменения сущестующих или появления новых файлов - выполняем задачи js(вывод в консоль сообщения) и reload - перезапуск browser-sync 
// аналогично по css и html
gulp.task('watch', ['clean', 'browser-sync', 'js', 'css', 'html', 'rigger', 'mainfiles'], function() {
    gulp.watch(config.src.main + config.src.js + '**/*.js', ['js', 'reload']);
    gulp.watch(config.src.main + config.src.css + '**/*.css', ['css', 'reload']);
    gulp.watch(config.src.main + '**/*.html', ['html', 'reload']);

});
