const { generateIV, generateSalt } = require("../../dist/generation.js");

describe("textEncryption", function() {
    describe("generateIV", function() {
        it("generates a buffer", function() {
            return generateIV().then(iv => {
                expect(iv).to.be.an.instanceof(Buffer);
            });
        });

        it("generates a non-empty value", function() {
            return generateIV().then(iv => {
                expect(iv.toString("hex")).to.have.length.above(0);
            });
        });
    });

    describe("generateSalt", function() {
        it("generates the correct length", function() {
            return generateSalt(42).then(salt => {
                expect(salt).to.have.lengthOf(42);
            });
        });

        it("generates base64", function() {
            return generateSalt(31).then(salt => {
                expect(salt).to.match(/^[a-zA-Z0-9/=+]{31}$/);
            });
        });

        it("throws if the number is not above 0", function() {
            return generateSalt(0).then(
                () => {
                    throw new Error("Should not have resolved");
                },
                err => {
                    expect(err).to.match(/Invalid length/i);
                }
            );
        });
    });
});
