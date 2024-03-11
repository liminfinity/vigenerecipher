export interface ICipher {
    encrypt: (openText: string, secretKey: string) => string
    decrypt: (cipherText: string, secretKey: string) => string
    hack: (cipherText: string) => string
}