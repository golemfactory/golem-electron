require('dotenv').config()
const fs = require('fs');
const path = require('path');
const notarizer = require('electron-notarize');

module.exports = async function(params) {
    if (process.platform !== 'darwin') {
        //Mac only
        return;
    }

    // Same appId in electron-builder.
    const appId = 'network.golem.app';

    const appPath = path.join(
        params.appOutDir,
        `${params.packager.appInfo.productFilename}.app`
    );
    if (!fs.existsSync(appPath)) {
        throw new Error(`Cannot find application at: ${appPath}`);
    }

    console.log(`Notarizing ${appId} found at ${appPath}`);

    try {
        await notarizer.notarize({
            appBundleId: appId,
            appPath: appPath,
            appleId: process.env.appleId,
            appleIdPassword: process.env.appleIdPassword,
            ascProvider: process.env.ascProvider
        });
    } catch (error) {
        console.error(error);
    }

    console.log(`Done notarizing ${appId}`);
};
