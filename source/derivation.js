const deriveKey = require("pbkdf2");

const DERIVED_KEY_ALGORITHM = "sha256";

/**
 * Derived key info
 * @typedef DerivedKeyInfo
 * @property {String} salt - The salt used
 * @property {Buffer} key - The derived key
 * @property {Buffer} hmac - The HMAC
 * @property {Number} rounds - The number of rounds used
 */

/**
 * Derive a key from a password
 * @param {Function} pbkdf2Gen The generator method
 * @param {String} password The password to derive from
 * @param {String} salt The salt (Optional)
 * @param {Number} rounds The number of iterations
 * @throws {Error} Rejects if no password is provided
 * @throws {Error} Rejects if no salt is provided
 * @throws {Error} Rejects if no rounds are provided
 * @returns {Promise.<DerivedKeyInfo>} A promise that resolves with an object (DerivedKeyInfo)
 */
function deriveFromPassword(pbkdf2Gen, password, salt, rounds) {
    if (!password) {
        return Promise.reject(new Error("Failed deriving key: Password must be provided"));
    }
    if (!salt) {
        return Promise.reject(new Error("Failed deriving key: Salt must be provided"));
    }
    if (!rounds || rounds <= 0) {
        return Promise.reject(new Error("Failed deriving key: Rounds must be greater than 0"));
    }
    const bits = (constants.PASSWORD_KEY_SIZE + constants.HMAC_KEY_SIZE) * 8;
    return pbkdf2Gen(
            password,
            salt,
            rounds,
            bits
        )
        .then(derivedKeyDat => derivedKeyData.toString("hex"))
        .then(function(derivedKeyHex) {
            const dkhLength = derivedKeyHex.length;
            const keyBuffer = new Buffer(derivedKeyHex.substr(0, dkhLength / 2), "hex");
            const hmacBuffer = new Buffer(derivedKeyHex.substr(dkhLength / 2, dkhLength / 2), "hex");
            return {
                salt: salt,
                key: keyBuffer,
                hmac: hmacBuffer,
                rounds: rounds
            };
        });
}

/**
 * The default PBKDF2 function
 * @param {String} password The password to use
 * @param {String} salt The salt to use
 * @param {Number} rounds The number of iterations
 * @param {Number} bits The size of the key to generate, in bits
 * @returns {Promise.<Buffer>} A Promise that resolves with the hash
 */
function pbkdf2(password, salt, rounds, bits) {
    return new Promise((resolve, reject) => {
        deriveKey(password, salt, rounds, bits / 8, DERIVED_KEY_ALGORITHM, (err, key) => {
            if (err) {
                return reject(err);
            }
            return resolve(key);
        });
    });
}

module.exports = {
    deriveFromPassword,
    pbkdf2
};
