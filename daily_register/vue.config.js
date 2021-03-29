const TARGET_DJANGO_STATIC_FOLDER="../rms/romei/static/daily_register_vue";

module.exports = {
    outputDir: `${TARGET_DJANGO_STATIC_FOLDER}/build`,
    filenameHashing: false,
    devServer: {
        writeToDisk: true, // Write files to disk in dev mode, so Django can serve the assets
    },
};
