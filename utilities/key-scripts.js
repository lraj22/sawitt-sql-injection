const crypto = require('crypto');
const fs = require('fs');

/* Create public and private keys
const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    // The standard secure default length for RSA keys is 2048 bits
    modulusLength: 2048,
});

const exportedPublicKeyBuffer = publicKey.export({
    type: 'pkcs1',
    format: 'pem',
});
fs.writeFileSync('../public-key.pem', exportedPublicKeyBuffer, 'utf-8');

const exportedPrivateKeyBuffer = privateKey.export({
    type: 'pkcs1',
    format: 'pem',
});
fs.writeFileSync('../.data/private.pem', exportedPrivateKeyBuffer, 'utf-8');
*/



/* Encrypt with private key
const dataToEncrypt = `This is some data.
It contains more than one line and is a message.
It is the time for something to happen.`;

const privateKey = Buffer.from(
    fs.readFileSync('../.data/private.pem', 'utf-8')
);

const encryptedData = crypto.privateEncrypt(
    {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_PADDING,
    },
    // We convert the data string to a buffer using `Buffer.from`
    Buffer.from(dataToEncrypt)
);

fs.writeFileSync('private_encrypt.txt', encryptedData.toString('base64'), {
    encoding: 'utf-8',
});
*/



/* Decrypt with public key
const encryptedData = fs.readFileSync('private_encrypt.txt', {
    encoding: 'utf-8',
});
const publicKey = fs.readFileSync('../public-key.pem', 'utf-8');

const decryptedData = crypto.publicDecrypt(
    {
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_PADDING,
    },
    Buffer.from(encryptedData, 'base64')
);

fs.writeFileSync('public_decrypt.txt', decryptedData.toString('utf-8'), {
    encoding: 'utf-8',
});
*/



/* Token-generating
const privateKey = Buffer.from(fs.readFileSync('../.data/private-key.pem', 'utf-8'));
const publicKey = Buffer.from(fs.readFileSync('../public-key.pem', 'utf-8'));

function prenc(data) {
    return crypto.privateEncrypt({ key: privateKey, padding: crypto.constants.RSA_PKCS1_PADDING }, Buffer.from(data));
}
function pudec(data) {
    return crypto.publicDecrypt({ key: publicKey, padding: crypto.constants.RSA_PKCS1_PADDING }, Buffer.from(data, 'base64'));
}

var userId = 4;
var timestamp = Date.now() + 7 * 24 * 60 * 60 * 1000; // a week from now
console.log(prenc([userId, timestamp].join(';')).toString('base64'));
*/