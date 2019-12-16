import * as crypto from "crypto";

/**
 * IV generator
 * @returns A newly generated IV
 */
export async function generateIV(): Promise<Buffer> {
    return new Buffer(crypto.randomBytes(16));
}

/**
 * Generate a random salt
 * @param length The length of the string to generate
 * @returns A promise that resolves with a salt (hex)
 * @throws {Error} Rejects if length is invalid
 */
export async function generateSalt(length: number): Promise<string> {
    if (length <= 0) {
        throw new Error(`Failed generating salt: Invalid length supplied: ${length}`);
    }
    let output = "";
    while (output.length < length) {
        output += crypto.randomBytes(3).toString("base64");
        if (output.length > length) {
            output = output.substr(0, length);
        }
    }
    return output;
}
