const { clean, html, sass, js, images, serve, reload } = require("./tasks.js");

const { series, parallel } = require('gulp');

// exports.clean = clean;
exports.html = html;
exports.sass = sass;
exports.js = js;
exports.images = images;
exports.serve = serve;
exports.reload = reload;

exports.default = series(parallel(html, sass, js), serve);