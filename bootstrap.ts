import { writeFile } from 'fs';
import { exit } from 'process';

const colors = require('colors');
const targetPath = './src/environments/firebase.environment.ts';

require('dotenv').config();
const firebaseConfig = process.env.INPUT_FIREBASE_CONFIG;
if (!firebaseConfig) {
  console.error(
    colors.redBG('INPUT_FIREBASE_CONFIG environment variable not set')
  );
  exit(1);
}
const envConfigFile = `export const firebaseConfig = JSON.parse(atob('${process.env.INPUT_FIREBASE_CONFIG}'));\n`;
console.log(colors.magenta('Writing `firebase.environment.ts`'));
writeFile(targetPath, envConfigFile, (err) => {
  if (err) {
    console.error(colors.redBG(err));
  } else {
    console.log(
      colors.magenta(
        `\`firebase.environment.ts\` generated correctly at ${targetPath}\n`
      )
    );
  }
});
