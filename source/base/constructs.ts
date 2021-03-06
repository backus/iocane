export interface ConfigurationOptions {
    /**
     * AES-CBC decryption function
     */
    decryption_cbc: DecryptionFunction;
    /**
     * AES-GCM decryption function
     */
    decryption_gcm: DecryptionFunction;
    /**
     * Default number of key derivation iterations
     */
    derivationRounds: number;
    /**
     * Key derivation helper/wrapper function
     */
    deriveKey: KeyDerivationFunction;
    /**
     * AES-CBC encryption function
     */
    encryption_cbc: EncryptionFunction;
    /**
     * AES-GCM encryption function
     */
    encryption_gcm: EncryptionFunction;
    /**
     * Random IV generation function
     */
    generateIV: IVGenerationFunction;
    /**
     * Random salt generation function
     */
    generateSalt: SaltGenerationFunction;
    /**
     * The encryption method - cbc/gcm
     */
    method: EncryptionType;
    /**
     * PBKDF2 derivation function
     */
    pbkdf2: PBKDF2Function;
    /**
     * Salt character length
     */
    saltLength: number;
}

/**
 * Decryption function that takes encrypted components and key derivation
 * data and returns a decrypted string asynchronously
 */
export interface DecryptionFunction {
    (encryptedComponents: EncryptedComponents, keyDerivationInfo: DerivedKeyInfo): Promise<string>;
}

export interface DerivedKeyInfo {
    salt: string;
    key: Buffer | ArrayBuffer;
    hmac: Buffer | ArrayBuffer | null;
    rounds: number;
}

export interface EncryptedComponents {
    content: string;
    iv: string;
    salt: string;
    auth: string;
    rounds: number;
    method: EncryptionType;
}

/**
 * Encryption function that takes a raw string, key derivation data and
 * an IV buffer. Returns an encrypted components payload, ready for
 * packing.
 */
export interface EncryptionFunction {
    (text: string, keyDerivationInfo: DerivedKeyInfo, iv: Buffer): Promise<EncryptedComponents>;
}

/**
 * Encryption type enumeration - sets the type of encryption to use and
 * is calculated automatically for decryption.
 */
export enum EncryptionType {
    CBC = "cbc",
    GCM = "gcm"
}

/**
 * Random IV generation function - returns an IV buffer aynchronously
 */
export interface IVGenerationFunction {
    (): Promise<Buffer | ArrayBuffer>;
}

/**
 * Key derivation helper - wraps a key derivation method and produces
 * derived-key information that can be provided to several functions.
 */
export interface KeyDerivationFunction {
    (
        deriveKey: PBKDF2Function,
        password: string,
        salt: string,
        rounds: number,
        generateHMAC?: boolean
    ): Promise<DerivedKeyInfo>;
}

/**
 * Key derivation method - returns a buffer, asynchronously, that matches
 * the specified number of bits (in hex form). Takes a raw password,
 * random salt, number of derivation rounds/iterations and the bits of
 * key to generate.
 */
export interface PBKDF2Function {
    (password: string, salt: string, rounds: number, bits: number): Promise<Buffer | ArrayBuffer>;
}

/**
 * An encrypted string payload, containing all necessary data for
 * decryption to occur (besides the password).
 */
export type PackedEncryptedContent = string;

/**
 * Salt generation function - takes a string length as the only parameter
 * and returns a random salt string asynchronously.
 */
export interface SaltGenerationFunction {
    (length: number): Promise<string>;
}
