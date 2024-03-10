import { ICipher } from "./ICipher";
import {writeFileSync} from 'fs'
import {resolve} from 'path'
interface IDistribution {
    [index: string]: number
}
interface ISlices {
    [index: string]: string[]
}

const russianLetterFrequencies: IDistribution = {
    'о': 0.11,
    'е': 0.09,
    'а': 0.08,
    'и': 0.07,
    'н': 0.067,
    'т': 0.063,
    'с': 0.055,
    'р': 0.047,
    'в': 0.045,
    'л': 0.043,
}
class VigenereCipher implements ICipher {

    private alphabet: string
    // private vigenereTable: string[]
    constructor() {
        this.alphabet = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя'
        // this.vigenereTable = this.createVigenereTable();
    }
    // private createVigenereTable() {
    //     const table: string[] = []
    //     for (let i = -1; i < this.alphabet.length - 1; i++) {
    //         const reverseAlphabet = this.alphabet.substring(i + 1) + this.alphabet.substring(0, i + 1);
    //         table.push(reverseAlphabet) 
    //     }
    //     return table

    // }
    public encrypt(openText: string, secretKey: string) {

        const textWithoutSpaces = this.cutSpaces(openText)
        const spacesIndexes: number[] = this.getSpaceIndexes(openText)
        const repeatedKey = this.repeatKey(secretKey, textWithoutSpaces.length)
        let cipherText = '';
        for (let i = 0; i < repeatedKey.length; i++) {
            const rowLetterIdx = this.alphabet.indexOf(repeatedKey[i]);
            const ceilLetterIdx = this.alphabet.indexOf(textWithoutSpaces[i]);
            cipherText += this.alphabet[(rowLetterIdx + ceilLetterIdx) % this.alphabet.length]
        }
        cipherText = this.insertSpaces(spacesIndexes, cipherText)
        return cipherText
    }

    public decrypt(cipherText: string, secretKey: string) {
        const cipherWithoutSpaces = this.cutSpaces(cipherText)
        const spacesIndexes: number[] = this.getSpaceIndexes(cipherText)
        const repeatedKey = this.repeatKey(secretKey, cipherWithoutSpaces.length)
        let openText = '';
        for (let i = 0; i < repeatedKey.length; i++) {
            const rowLetterIdx = this.alphabet.indexOf(repeatedKey[i]);
            const ceilLetterIdx = this.alphabet.indexOf(cipherWithoutSpaces[i]);
            openText += this.alphabet[(ceilLetterIdx + this.alphabet.length - rowLetterIdx) % this.alphabet.length]
        }
        openText = this.insertSpaces(spacesIndexes, openText)
        return openText
    }
    
    public hack(cipherText: string) {
        const cipherWithoutSpaces = this.cutSpaces(cipherText)
        const spacesIndexes: number[] = this.getSpaceIndexes(cipherText)
        
        const distances = this.getDistancesCombinations(cipherWithoutSpaces)
        const divisors = distances.map(dist => this.factorize(dist)).flat();
        const distribution = this.divisorDistribution(divisors)
        const probableKeyLengths = this.getGreatestDivisors(distribution)
        const groupsByShift = this.groupingByShift(cipherWithoutSpaces, probableKeyLengths)
        for (let keyLength in groupsByShift) {
            const keys = new Array(groupsByShift[keyLength].length).fill('')
            for (let i = 0; i < groupsByShift[keyLength].length; i++) {
                const groups = groupsByShift[keyLength]
                const lettersDistribution = this.lettersDistribution(groups[i]);
                const mostFreqLetter = this.getMostFreqLetter(lettersDistribution)
                for (let letter in russianLetterFrequencies) {
                    const dist = (this.alphabet.length - this.alphabet.indexOf(letter) + this.alphabet.indexOf(mostFreqLetter))
                     % this.alphabet.length
                    const keyLetter = this.alphabet[dist];
                    keys[i] += keyLetter
                }
            }
            // const openTexts =  this.combineStrings(keys).map(key => {
            //     const decrypt = this.decrypt(cipherText, key);
            //     return this.insertSpaces(spacesIndexes, decrypt)
            // })
            // writeFileSync(resolve('answer.txt'), this.combineStrings(keys).map(str => str + '\n').join(''))

        }

        return ''

    };
    private combineStrings(input: string[]): string[] {
        if (input.length === 0) {
          return [];
        }
      
        const result: string[] = [""];
        
        for (const str of input) {
          const currentResult: string[] = [];
      
          for (const res of result) {
            for (const char of str) {
              currentResult.push(res + char);
            }
          }
      
          result.length = 0;
          result.push(...currentResult);
        }
      
        return result
      }

    private groupingByShift(text: string, probableKeyLengths: number[]) {
        const resultGroup: ISlices = {};
        for (let keyLen of probableKeyLengths) {
            resultGroup[keyLen] = []
            for (let i = 0; i < text.length; i++) {
                const shift = i % keyLen;
                if (resultGroup[keyLen][shift]) {
                    resultGroup[keyLen][shift] += text[i]
                }
                else {
                    resultGroup[keyLen][shift] = text[i]
                }
            }
        }
        return resultGroup
    }
    private getMostFreqLetter(distribution: IDistribution) {
        const maxFrequency = Math.max(...Object.values(distribution))
        return Object.keys(distribution).find(key => distribution[key] === maxFrequency) as string
    }
    private getGreatestDivisors(distribution: IDistribution) {
        const maxFrequency = Math.max(...Object.values(distribution))
        return Object.keys(distribution).filter(key => distribution[key] === maxFrequency).map(key => +key)
    }
    private lettersDistribution(text: string) {
        return text.split('').reduce((prev: IDistribution, cur: string) => {
            prev[cur] = prev[cur] != undefined ? prev[cur] + 1 : 1
            return prev
        }, {})
    }
    private divisorDistribution(divisors: number[]) {
        return divisors.reduce((prev: IDistribution, cur: number) => {
            if (cur != 2) prev[cur] = prev[cur] != undefined ? prev[cur] + 1 : 0
            return prev
        }, {})
    }
    private factorize(number: number) {
        const factors: number[] = []
        const numSqrl = Math.ceil(Math.sqrt(number))
        for (let i = 2; i < numSqrl; i++) {
            if (number % i) {
                factors.push(i, Math.floor(number / i))
                continue;
            }
        }
        return factors;
    }
    private getDistancesCombinations(text: string) {
        const regExp = /(.{2,}?).*\1/g
        let match: RegExpExecArray | null;
        const distances: number[] = []
        while ((match = regExp.exec(text))) {
            const distance = match[0].lastIndexOf(match[1])
            distances.push(distance)
            regExp.lastIndex = match.index + 1
        }
        return distances;
    }
    private getSpaceIndexes(text: string) {
        return text.split('').map((symb, idx) => /\s/.test(symb) ? idx : NaN)
        .filter(symb => !isNaN(symb))
    }
    private cutSpaces(text: string) {
        return text.replace(/\s/g, '');
    }
    private repeatKey(key: string, repeatCnt: number) {
        let repeatedKey = ''
        for (let i = 0; i < repeatCnt; i++) {
            repeatedKey += key[(i + key.length) % key.length]
        }
        return repeatedKey;
    }
    private insertSpaces(spacesIndexes: number[], text: string) {
        let resultText = text
        spacesIndexes.forEach(idx => {
            resultText = resultText.substring(0, idx) + ' ' + resultText.substring(idx);
        })
        return resultText
    }
}

const vigenereCipher = new VigenereCipher()

export {vigenereCipher}