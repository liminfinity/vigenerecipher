import {Interface} from 'readline'
import { vigenereCipher } from '../cipher/VigenereCipher'
import chalk from 'chalk';

const bold = chalk.bold
const success = chalk.red.bold.greenBright
const error = chalk.redBright.bold

export class CipherPrompts {

    constructor(private rl: Interface) {}

    private getLines(color: string) {
        
        return chalk.keyword(color)('~'.repeat(30));
    }
    entryPoint(this: CipherPrompts) {

        this.rl.question(`${this.getLines('yellow')}\n${bold('Выберите функционал:')}\n` +
        `1.Зашифровать сообщение\n2.Расшифровать сообщение\n3.Завершить программу\n${this.getLines('yellow')}\nВведите номер пункта:`, point => {
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
                    this.closeRL();
                    return
                }
                default: {
                    this.getErrorMessage("Неверное значение", this.entryPoint)
                }
            }
        })
    }
    private inputEncrypt(this: CipherPrompts) {
        this.rl.question('Введите открытый текст:', openText => {
            if (!this.isRusLang(openText)) {
                this.getErrorMessage("Только кириллица", this.inputEncrypt)
            }
            else {
                this.rl.question('Введите ключ шифрования:', key => {
                    if (!this.isRusLang(key)) {
                        this.getErrorMessage("Только кириллица", this.inputEncrypt)
                        return;
                    }
                    const cipherText = vigenereCipher.encrypt(openText, key.toLowerCase())
                    this.rl.write(`${bold('Шифр текст:')} ${success(cipherText)}`)
                    setTimeout(() => {
                        this.entryPoint()
                    }, 3000);
                })
            }
            
        })
    }
    private inputDecrypt(this: CipherPrompts) {
        this.rl.question('Введите зашифрованный текст:', cipherText => {
            if (!this.isRusLang(cipherText)) {
                this.getErrorMessage("Только кириллица", this.inputDecrypt)
            }
            else {
                this.rl.question('Введите ключ шифрования:', key => {
                    if (!this.isRusLang(key)) {
                        this.getErrorMessage("Только кириллица", this.inputDecrypt)
                        return;
                    }
                    const openText = vigenereCipher.decrypt(cipherText, key.toLowerCase())
                    
                    this.rl.write(`${bold('Открытый текст:')} ${success(openText)}`)
                    setTimeout(() => {
                        this.entryPoint()
                    }, 3000);
                })
            }
        })
    }
    private getErrorMessage(message: string, cb?: () => void) {
        this.rl.write(error(message))
        if (cb) {
            setTimeout(() => {
                cb.bind(this)()
             }, 2000);
        }   
    }
    private isRusLang(text: string) {
        return text.split('').every(letter => /[а-яё\s]/i.test(letter))
    }
    private closeRL() {
        this.rl.write(success(`До свидания!`))
        setTimeout(() => {
            this.rl.close()
         }, 2000);
    }
}

