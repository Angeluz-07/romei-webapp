const TARGET_DJANGO_STATIC_FOLDER="../static/daily_register";

module.exports = {
    outputDir: process.env.NODE_ENV === 'production' 
    ? './build'
    : `${TARGET_DJANGO_STATIC_FOLDER}/build`,
    filenameHashing: false,
    devServer: {
        writeToDisk: true, // Write files to disk in dev mode, so Django can serve the assets
    },
};
