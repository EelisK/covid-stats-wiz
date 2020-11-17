import { writeFile } from 'fs';

const colors = require('colors');
const targetPath = './src/environments/firebase.environment.ts';

require('dotenv').config();
const envConfigFile = `export const firebaseConfig = JSON.parse(atob('${process.env.FIREBASE_CONFIG}'));\n`;
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
