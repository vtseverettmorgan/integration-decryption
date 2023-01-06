import { expect } from 'chai';
import * as cryptoJs from 'crypto-js';
import * as main from '../src/index';

const encrypt = (string: string) => cryptoJs.AES.encrypt(string, '123').toString();

describe('decrypt', function () {
        describe('#getFirstArgument()', function () {
                it('should get the 3rd argument from an array', function () {
                        const array = ['foo', 'bar', 'baz'];
                        const argument = main.getFirstArgument(array);
                        expect(argument).to.equal('baz');
                });

                it('should return undefined if < 3 elements exist', function () {
                        const array = ['foo', 'bar'];
                        const argument = main.getFirstArgument(array);
                        expect(argument).to.equal(undefined);
                });
        });

        describe('#decryptString()', function () {
                it('should decrypt strings with the provided key', function () {
                        const encrypted = encrypt('123');
                        const decrypted = main.decryptString(encrypted, '123');
                        expect(decrypted).to.equal('123');
                });

                it('should throw an error if no encryption key is provided', function () {
                        const encrypted = encrypt('123');

                        try {
                                main.decryptString(encrypted);
                        } catch (err) {
                                expect(err).to.be.instanceof(Error);
                        }
                });

                it('should return the encrypted value if the decryption fails', function () {
                        const encrypted = encrypt('123');
                        const decrypted = main.decryptString(encrypted, '124');

                        expect(decrypted).to.equal(encrypted);
                });
        });

        describe('#decryptObject()', function () {
                it('should only decrypt first-level strings in an object with the provided key', function () {
                        const e = encrypt('e');

                        const encrypted = {
                                a: encrypt('a'),
                                b: encrypt('b'),
                                c: encrypt('c'),
                                d: { e },
                        };

                        const decrypted = main.decryptObject(encrypted, '123');

                        expect(decrypted).to.deep.equal({
                                a: 'a',
                                b: 'b',
                                c: 'c',
                                d: { e },
                        });
                });
        });

        describe('#main()', function () {
                it('should decrypt a string', function () {
                        const encrypted = encrypt('foo');

                        const decrypted = main.main(['process', 'filename', encrypted], '123');

                        expect(decrypted).to.equal('foo');
                });

                it('should decrypt an object', function () {
                        const encrypted = JSON.stringify({
                                test: encrypt('foo'),
                        });

                        const decrypted = main.main(['process', 'filename', encrypted], '123');

                        expect(decrypted).to.deep.equal({
                                test: 'foo',
                        });
                });
        });
});
