import { ESLint } from "eslint";

// 1. Create an instance.
const eslint = new ESLint();

// 2. Lint files.
const results = await eslint.lintFiles(["out/**/*.js"]);

// 3. Format the results.
const formatter = await eslint.loadFormatter("stylish");
const resultText = formatter.format(results);

console.log(resultText);