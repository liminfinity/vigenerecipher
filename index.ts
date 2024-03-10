import { vigenereCipher } from "./cipher/VigenereCipher";
import { ICipher } from "./cipher/ICipher";
import chalk from "chalk";

const ciphers: ICipher[] = [vigenereCipher];

ciphers.forEach(cipher => console.log(chalk(cipher.hack('въэмъдлкб ъдех ъйщъеесффх ъщуючатюыдш к дичдзйазъев цточцвыо каткыою к вйчдлдз ынлщю.'))))
