const babel       = require('gulp-babel'),
      browserSync = require('browser-sync').create(),
      ftp         = require('vinyl-ftp'),
      gulp        = require('gulp'),
      htmlmin     = require('gulp-htmlmin'),
      minifyCss   = require('gulp-minify-css'),
      mocha       = require('gulp-mocha'),
      plumber     = require('gulp-plumber'),
      rimraf      = require('gulp-rimraf'),
      sass        = require('gulp-sass'),
      uglify      = require('gulp-uglify'),
      usemin      = require('gulp-usemin'),
      util        = require('gulp-util');

// path regexes to match certain file groups
const glob = {
    all         : '**/*',
    assets      : 'assets/**/*',
    html        : '**/*.html',
    js          : '**/*.js',
    scss        : '**/*.scss',
    css         : '**/*.css',
    testOnline  : '**/test-online*.js', // test that should only be run locally
    testOffline : '**/test-offline-*.js' // test that can be run on travis
};

// useful paths to parts of the project
const path = {
    src   : 'src/',
    debug : 'debug/',
    ship  : 'ship/',
    bower : 'bower_components/',
    ftp   : '/site/wwwroot', // Azure Web App
    test  : 'test/'
};

// Clean the debug/ and ship/ folders
gulp.task('rmrf', () =>
    gulp.src([path.debug, path.ship])
        .pipe(rimraf())
);

// Compiles the markup (html)
gulp.task('markup', () =>
    gulp.src(path.src + glob.html)
        .pipe(gulp.dest(path.debug))
);

// Compiles the scripts (js)
gulp.task('script', () =>
    gulp.src(path.src + glob.js)
        .pipe(plumber())
        .pipe(babel())
        .pipe(gulp.dest(path.debug))
);

// Compiles the styles (css)
gulp.task('compile-css', () =>
    gulp.src(path.src + '_scss/style.scss')
        .pipe(plumber())
        .pipe(sass({
            includePaths: [
                path.bower + 'office-ui-fabric/dist/sass',
                path.src + '_scss'
            ]
         }))
        .pipe(gulp.dest(path.debug))
);

// Run tests and create a debug build of the web application
gulp.task('build', ['markup', 'script', 'compile-css', 'test-offline']);

// Creates a debug build and serves it at https://localhost:8443/
gulp.task('serve', ['build'], () => {
    browserSync.init({
        https: true,
        notify: false,
        port: 8443,
        server: {
            baseDir: path.debug,
            routes: {
                '/bower_components': 'bower_components',
                '/chartjs2beta2': 'chartjs2beta2',
                '/src/images': 'src/images',
                '/privacy-policy': 'src/privacy-policy-page.html',
                '/support': 'src/support-page.html'
            }
        }
    });

    gulp.watch(path.src + glob.scss, ['bs-stream'])
    gulp.watch([path.src + glob.html, path.src + glob.js, path.test + glob.js], ['bs-reload']);
});

// Streams style changes to Browsersync clients
gulp.task('bs-stream', ['compile-css'], () =>
    gulp.src(path.debug + glob.css)
        .pipe(browserSync.stream())
);

// Triggers a refresh on Browsersync clients
gulp.task('bs-reload', ['build'], browserSync.reload);

// Moves assets to /ship
gulp.task('ship-assets', () =>
    gulp.src(path.debug + glob.assets)
        .pipe(gulp.dest(path.ship + 'assets'))
);

// Creates a production build in /ship
gulp.task('ship-build', ['build', 'ship-assets'], () =>
    gulp.src(path.debug + 'index.html')
        .pipe(usemin({
            html: [
                htmlmin({
                    collapseWhitespace: true,
                    removeTagWhitespace: true
                })
            ],
            css: [ minifyCss ],
            js: [ uglify ],
            vendorjs: [ () => uglify({ preserveComments: 'some' }) ]
        }))
        .pipe(gulp.dest(path.ship))
);

// Creates a production build and deploys it to an FTP server using the credentials
// stored in ftp.json (schema: { "host": "...", "user": "...", "pass": "..." })
gulp.task('ship', ['ship-build'], () => {
    const config = require('./ftp.json');
    const conn = ftp.create({
        host:     config.host,
        user:     config.user,
        password: config.pass,
        log:      util.log,
        parallel: 6,
        secure:   true
    });

    gulp.src(path.ship + glob.all, { buffer: false })
        .pipe(conn.newer(path.ftp)) // only upload newer files
        .pipe(conn.dest(path.ftp));
});

// Run tests that don't make network accesses.
gulp.task('test-offline', function() {
  return gulp.src([path.test + glob.testOffline], { read: false })
    .pipe(mocha({timeout: 5000}));
});

// Run tests that make network accesses.
gulp.task('test-online', function() {
  return gulp.src([path.test + glob.testOnline], { read: false })
    .pipe(mocha({timeout: 5000}));
});

// Run all tests.
gulp.task('test-all', function() {
  return gulp.src([path.test + glob.testOnline, path.test + glob.testOffline], { read: false })
    .pipe(mocha({timeout: 5000}));
});
// When gulp is executed without args run the serve task
gulp.task('default', ['serve']);