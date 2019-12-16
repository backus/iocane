const { decryptCBC, decryptGCM, encryptCBC, encryptGCM } = require("../../dist/textEncryption.js");
const { deriveFromPassword, pbkdf2 } = require("../../dist/derivation.js");
const { generateIV } = require("../../dist/generation.js");

const ENCRYPTED_SAMPLE = "at5427PQdplGgZgcmIjy/Fv0xZaiKO+bzmY7NsnYj90=";
const ENCRYPTED_SAMPLE_RAW = "iocane secret text";

describe("textEncryption", function() {
    describe("decryptCBC", function() {
        beforeEach(function() {
            return deriveFromPassword(pbkdf2, "pass", "salt", 1000)
                .then(keyDerivationInfo => {
                    this.keyDerivationInfo = keyDerivationInfo;
                    return generateIV();
                })
                .then(iv => {
                    return encryptCBC(ENCRYPTED_SAMPLE_RAW, this.keyDerivationInfo, iv);
                })
                .then(encryptedComponents => {
                    this.encryptedComponents = encryptedComponents;
                });
        });

        it("decrypts encrypted components", function() {
            return decryptCBC(this.encryptedComponents, this.keyDerivationInfo).then(raw => {
                expect(raw).to.equal(ENCRYPTED_SAMPLE_RAW);
            });
        });
    });

    describe("decryptGCM", function() {
        beforeEach(function() {
            return deriveFromPassword(pbkdf2, "pass", "salt", 1000)
                .then(keyDerivationInfo => {
                    this.keyDerivationInfo = keyDerivationInfo;
                    return generateIV();
                })
                .then(iv => {
                    return encryptGCM(ENCRYPTED_SAMPLE_RAW, this.keyDerivationInfo, iv);
                })
                .then(encryptedComponents => {
                    this.encryptedComponents = encryptedComponents;
                });
        });

        it("decrypts encrypted components", function() {
            return decryptGCM(this.encryptedComponents, this.keyDerivationInfo).then(raw => {
                expect(raw).to.equal(ENCRYPTED_SAMPLE_RAW);
            });
        });
    });

    describe("encryptCBC", function() {
        beforeEach(function() {
            return deriveFromPassword(pbkdf2, "pass", "salt", 1000)
                .then(keyDerivationInfo => {
                    this.keyDerivationInfo = keyDerivationInfo;
                    return generateIV();
                })
                .then(iv => {
                    this.iv = iv;
                });
        });

        it("encrypts text", function() {
            return encryptCBC(ENCRYPTED_SAMPLE_RAW, this.keyDerivationInfo, this.iv).then(
                encrypted => {
                    expect(encrypted)
                        .to.have.property("content")
                        .that.is.a("string");
                    expect(encrypted.content).to.not.contain(ENCRYPTED_SAMPLE_RAW);
                }
            );
        });

        it("outputs expected components", function() {
            return encryptCBC(ENCRYPTED_SAMPLE_RAW, this.keyDerivationInfo, this.iv).then(
                encrypted => {
                    expect(encrypted)
                        .to.have.property("auth")
                        .that.matches(/^[a-f0-9]{64}$/);
                    expect(encrypted).to.have.property("rounds", 1000);
                    expect(encrypted)
                        .to.have.property("iv")
                        .that.matches(/^[a-f0-9]+$/);
                    expect(encrypted).to.have.property("salt", "salt");
                    expect(encrypted).to.have.property("method", "cbc");
                }
            );
        });
    });

    describe("encryptGCM", function() {
        beforeEach(function() {
            return deriveFromPassword(pbkdf2, "pass", "salt", 1000)
                .then(keyDerivationInfo => {
                    this.keyDerivationInfo = keyDerivationInfo;
                    return generateIV();
                })
                .then(iv => {
                    this.iv = iv;
                });
        });

        it("encrypts text", function() {
            return encryptGCM(ENCRYPTED_SAMPLE_RAW, this.keyDerivationInfo, this.iv).then(
                encrypted => {
                    expect(encrypted)
                        .to.have.property("content")
                        .that.is.a("string");
                    expect(encrypted.content).to.not.contain(ENCRYPTED_SAMPLE_RAW);
                }
            );
        });

        it("outputs expected components", function() {
            return encryptGCM(ENCRYPTED_SAMPLE_RAW, this.keyDerivationInfo, this.iv).then(
                encrypted => {
                    expect(encrypted)
                        .to.have.property("auth")
                        .that.matches(/^[a-f0-9]+$/);
                    expect(encrypted).to.have.property("rounds", 1000);
                    expect(encrypted)
                        .to.have.property("iv")
                        .that.matches(/^[a-f0-9]+$/);
                    expect(encrypted).to.have.property("salt", "salt");
                    expect(encrypted).to.have.property("method", "gcm");
                }
            );
        });
    });
});
