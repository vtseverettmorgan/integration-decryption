const fs = require('fs');
const path = require('path');
const basePath = path.resolve(__dirname, '..', 'Rise_Ionic');
const envFilePath = path.resolve(basePath, '.env');
const cryptoJs = require(path.resolve(basePath, 'node_modules/crypto-js'));

function getFirstArgument() {
    const args = process.argv.slice(2);

    const firstArgument = args[0];

    return firstArgument;
}

function getEnvFileContents() {
    const fileInRiseIconicDirectory = fs.readdirSync(basePath);

    const envExists = fileInRiseIconicDirectory.find((file) => file === '.env');

    if (!envExists) {
        throw new Error(`did not find a .env file in the current working directory...exiting`);
    }

    const contents = fs.readFileSync(envFilePath)?.toString();

    return contents;
}

function getIntegrationKeyFromEnv(fileContent) {
    const matches = fileContent.match('INTEGRATIONS_ENCRYPTION_KEY=([^\n]+)');

    if (!matches) {
        throw new Error(`did not find INTEGRATION_ENCRYPTION_KEY defined in .env file...exiting`);
    }

    const encryptionKey = matches[1];

    return encryptionKey;
}

function decrypt(value, key) {
    return cryptoJs.AES
        .decrypt(value, key)
        .toString(cryptoJs.enc.Utf8);
}

(function main() {
    const firstArgument = getFirstArgument();
    const envContents = getEnvFileContents();
    const encryptionKey = getIntegrationKeyFromEnv(envContents);
    try {
        const object = JSON.parse(firstArgument);
        Object.entries(object).map(([key, value]) => {
            object[key] = decrypt(value, encryptionKey);
        });
        console.log(object);
    } catch (e) {
        const decoded = decrypt(firstArgument, encryptionKey);
        console.log(decoded);
    }
})();