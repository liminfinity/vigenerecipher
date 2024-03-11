import { vigenereCipher } from "./cipher/VigenereCipher";
import readline from 'readline'
import { CipherPrompts } from "./prompts/cipherPrompts";
const app = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
})
const prompts = new CipherPrompts(app);

prompts.entryPoint();

app.on('close', () => {
    process.exit(0);
});






