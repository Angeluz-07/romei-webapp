const TARGET_DJANGO_STATIC_FOLDER="../backend/romei/daily_register/static/daily_register";

module.exports = {
    outputDir: `${TARGET_DJANGO_STATIC_FOLDER}/build`,
    filenameHashing: false,
    devServer: {
        writeToDisk: true, // Write files to disk in dev mode, so Django can serve the assets
    },
};