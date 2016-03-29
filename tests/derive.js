var lib = require("../source/index.js");

function deriveFromFile(cb, salt, rounds) {
    lib.derivation.deriveFromFile(__dirname + "/resources/gradient.png", function(err, kdi) {
        (cb)(err, kdi);
    }, salt, rounds);
}

module.exports = {

    setUp: function(done) {
        (done)();
    },

    tearDown: function(done) {
        (done)();
    },

    deriveFromFile: {

        testDerivesDefault: function(test) {
            deriveFromFile(function(err, derived) {
                test.strictEqual(
                    derived.key.length,
                    lib.config.PASSWORD_KEY_SIZE,
                    "Derived key should be correct length"
                );
                test.strictEqual(
                    derived.hmac.length,
                    lib.config.HMAC_KEY_SIZE,
                    "HMAC should be correct length"
                );
                test.ok(derived.rounds >= lib.config.DERIVED_KEY_ITERATIONS_MIN &&
                    derived.rounds <= lib.config.DERIVED_KEY_ITERATIONS_MAX,
                    "Derived rounds should be in the acceptable range");
                test.done();
            });
        },

        testDerivesSameRepeatedly: function(test) {
            deriveFromFile(function(err, derived1) {
                deriveFromFile(function(err, derived2) {
                    test.ok(derived2.key.equals(derived1.key), "Keys should match");
                    test.strictEqual(derived2.salt, derived1.salt, "Salts should match");
                    test.strictEqual(derived2.rounds, derived1.rounds, "Rounds should match");
                    test.done();
                }, derived1.salt, derived1.rounds);
            });
        }

    },

    deriveFromPassword: {

        testDerivesDefault: function(test) {
            var derived = lib.derivation.deriveFromPassword("abc");
            test.strictEqual(
                derived.key.length,
                lib.config.PASSWORD_KEY_SIZE,
                "Derived key should be correct length"
            );
            test.strictEqual(
                derived.hmac.length,
                lib.config.HMAC_KEY_SIZE,
                "HMAC should be correct length"
            );
            test.ok(derived.rounds >= lib.config.DERIVED_KEY_ITERATIONS_MIN &&
                derived.rounds <= lib.config.DERIVED_KEY_ITERATIONS_MAX,
                "Derived rounds should be in the acceptable range");
            test.done();
        },

        testDerivesSameRepeatedly: function(test) {
            var derived1 = lib.derivation.deriveFromPassword("abc"),
                derived2 = lib.derivation.deriveFromPassword("abc", derived1.salt, derived1.rounds);
            test.ok(derived2.key.equals(derived1.key), "Keys should match");
            test.strictEqual(derived2.salt, derived1.salt, "Salts should match");
            test.strictEqual(derived2.rounds, derived1.rounds, "Rounds should match");
            test.done();
        }

    }

};
