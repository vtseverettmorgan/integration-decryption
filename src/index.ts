import { config } from 'dotenv';
import * as cryptoJs from 'crypto-js';

config();

/**
 * Returns the 3rd argument from the provided array,
 * which is the 1st argument when passing process.args
 * @param processArgs array of arguments to use
 */
export function getFirstArgument(processArgs: string[]): object | string {
        const [argument] = processArgs.slice(2);

        try {
                return JSON.parse(argument);
        } catch (e) {
                return argument;
        }
}

/**
 * Attempts to decrypt a string with the provided key.
 * It will return the encrypted string if it encounters an error.
 * @param value value to decrypt
 * @param encryptionKey secret to decrypt value
 */
export function decryptString(value: string, encryptionKey?: string) {
        if (!encryptionKey) {
                throw new Error('You must specify INTEGRATION_ENCRYPTION_KEY in the ./.env file!');
        }

        try {
                const decrypted = cryptoJs.AES.decrypt(value, encryptionKey);

                if (decrypted.sigBytes <= 0) {
                        return value;
                }

                return decrypted.toString(cryptoJs.enc.Utf8);
        } catch (err) {
                return value;
        }
}

/**
 * Copies the provided object and attempts to decrypt first level strings.
 * If an error occurs during decryption, default to the decrypted value.
 * @param object object with values to decrypt
 * @param encryptionKey secret to decrypt object
 */
export function decryptObject(object: { [key: string]: any }, encryptionKey?: string) {
        if (!encryptionKey) {
                throw new Error('You must specify INTEGRATION_ENCRYPTION_KEY in the ./.env file!');
        }

        const copy = { ...object };

        Object.entries(copy).forEach(([key, value]) => {
                if (typeof value === 'string') {
                        copy[key] = decryptString(value, encryptionKey);
                }
        });

        return copy;
}

export function main(args: string[], key?: string) {
        const input = getFirstArgument(args);

        if (typeof input === 'object' && !Array.isArray(input)) {
                return decryptObject(input, key);
        } if (typeof input === 'string' && input) {
                return decryptString(input, key);
        }

        console.error({ input });
        throw new Error('There was an issue processing the provided input!');
}

console.log(main(process.argv, process.env.INTEGRATION_ENCRYPTION_KEY));
