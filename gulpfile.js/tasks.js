const paths = require("./paths.js");

// gulp
const { gulp, src, dest, watch, series, parallel } = require('gulp');
const del = require("del");
const package = require("../package.json");

// load all plugins in "devDependencies" into the variable $
const $ = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'gulp.*'],
    lazy: true,
    camelize: true
});

console.log($);

const server = require('browser-sync').create();

const banner = [
    '/*!',
    ' | <%= package.name %> - <%= package.version %>',
    ' | <%= package.description %>',
    ' | Copyright ' + new Date().getFullYear(),
    ' | <%= package.author %>',
    ' | Licenced under <%= package.license %>',
    ' | <%= package.repository %>',
    ' **/\n'
].join('\n');

const onError = (err) => {
    console.log(err);
};

const clean = (e) => {
    if (!paths.settings.clean) return e();
    console.log("-> Clean");
    return $.del([
        "dist"
    ]);
};

const html = (e) => {
    if (!paths.settings.html) return e();
    console.log("-> Compile HTML");
    return src(paths.source.html)
        .pipe($.plumber({ errorHandler: onError }))
        .pipe($.html())
        .pipe(dest(paths.dist.html));
};

const sass = (e) => {
    if (!paths.settings.css) return e();
    console.log("-> Compile SASS");
    return src(paths.source.sass)
        .pipe($.plumber({ errorHandler: onError }))
        .pipe($.sourcemaps.init({ loadMaps: true }))
        .pipe($.sass.sync({ outputStyle: 'compressed' }))
        .pipe($.autoprefixer())
        .pipe($.sourcemaps.write())
        .pipe($.header(banner, { package: package }))
        .pipe($.size({ gzip: true, showFiles: true }))
        .pipe($.rename({ suffix: ".min" }))
        .pipe(dest(paths.dist.css));
};

const js = (e) => {
    if (!paths.settings.javascript) return e();
    console.log("-> Transpiling Javascript");
    return src(paths.source.js)
        .pipe($.plumber({ errorHandler: onError }))
        .pipe($.newer({ dest: paths.dist.js }))
        .pipe($.babel(({
            presets: ['@babel/env']
        })))
        .pipe($.uglify())
        .pipe($.header(banner, { package: package }))
        .pipe($.size({ gzip: true, showFiles: true }))
        .pipe($.rename({ suffix: ".min" }))
        .pipe(dest(paths.dist.js));
};

const images = (e) => {
    if (!paths.settings.images) return e();
    console.log("-> Compile Images");
    return src(paths.source.images + "**/*.{png,jpg,jpeg,gif,svg}")
        .pipe($.newer({ dest: paths.dist.images }))
        .pipe($.plumber({ errorHandler: onError }))
        .pipe($.imagemin({
            progressive: true,
            interlaced: true,
            optimizationLevel: 7,
            svgoPlugins: [{ removeViewBox: false }],
            verbose: true,
            use: []
        }))
        .pipe(gulp.dest(paths.dist.images));
};


const reload = (e) => {
    server.reload();
    e();
}

const serve = (e) => {
    server.init({
        server: {
            baseDir: './dist/'
        }
    });

    watch(paths.source.html, series(html, reload));
    watch(paths.source.sass, series(sass, reload));
    watch(paths.source.js, series(js, reload));
    e();
}

exports.serve = serve;
// exports.clean = clean;
exports.html = html;
exports.sass = sass;
exports.js = js;
exports.images = images;
exports.serve = serve;
exports.reload = reload;