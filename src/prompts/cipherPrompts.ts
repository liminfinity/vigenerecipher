import {Interface} from 'readline'
import { vigenereCipher } from '../cipher/VigenereCipher'
export class CipherPrompts {
    constructor(private rl: Interface) {}
    private getLines() {
        return '~'.repeat(30);
    }
    entryPoint() {
        this.rl.question(`${this.getLines()}\nВыберите функционал:\n` +
        `1.Зашифровать сообщение\n2.Расшифровать сообщение\n3.Завершить программу\n${this.getLines()}\nВведите номер пункта:`, point => {
            switch (point) {
                case '1': {
                    this.inputEncrypt()
                    return
                }
                case '2': {
                    this.inputDecrypt()
                    return
                }
                case '3': {
                    this.rl.close();
                    return
                }
                default: {
                    this.rl.write('Неверное значение')
                    setTimeout(() => {
                        this.entryPoint()
                    }, 1000);
                }
            }
        })
    }
    private inputEncrypt() {
        this.rl.question('Введите открытый текст:', openText => {
            this.rl.question('Введите ключ шифрования:', key => {
                const cipherText = vigenereCipher.encrypt(openText, key)
                this.rl.write(`Шифр текст: ${cipherText}`)
                setTimeout(() => {
                    this.entryPoint()
                }, 1000);
                
            })
        })
    }
    private inputDecrypt() {
        this.rl.question('Введите зашифрованный текст:', cipherText => {
            this.rl.question('Введите ключ шифрования:', key => {
                const openText = vigenereCipher.decrypt(cipherText, key)
                this.rl.write(`Открытый текст: ${openText}`)
                setTimeout(() => {
                    this.entryPoint()
                }, 1000);
            })
        })
    }
}

