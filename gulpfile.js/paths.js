module.exports = {
    source: {
        base: "./src",
        html: "./src/*.html",
        sass: "./src/sass/*",
        js: "./src/js/*",
        images: "./src/img/*",
        fonts: "./src/fonts/*"
    },
    dist: {
        html: "./dist/",
        css: "./dist/css/",
        js: "./dist/js/",
        images: "dist/img/",
        fonts: "./dist/fonts/"
    },
    settings: {
        html: true,
        css: true,
        javascript: true,
        images: true,
        fonts: false,
        clean: true
    }

};