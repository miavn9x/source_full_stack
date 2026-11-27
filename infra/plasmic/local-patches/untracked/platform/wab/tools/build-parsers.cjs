const fs = require("fs");
const path = require("path");
const peg = require("pegjs");
const coffeePlugin = require("pegjs-coffee-plugin");

const wabDir = path.resolve(__dirname, "..");
const genDir = path.join(wabDir, "src", "wab", "gen");

if (!fs.existsSync(genDir)) {
  fs.mkdirSync(genDir, { recursive: true });
}

function compilePeg(inputFile, outputFile, isCoffee, allowedStartRules) {
  const inputPath = path.join(wabDir, inputFile);
  const outputPath = path.join(genDir, outputFile);

  console.log(`Compiling ${inputFile} -> ${outputFile}...`);
  const grammar = fs.readFileSync(inputPath, "utf8");
  const options = {
    output: "source",
    format: "commonjs",
    plugins: isCoffee ? [coffeePlugin] : [],
  };
  if (allowedStartRules) {
    options.allowedStartRules = allowedStartRules;
  }

  const rawParser = peg.generate(grammar, options);
  const wrapped =
    "/* eslint-disable */\n" +
    rawParser.replace(/^module\.exports\s*=\s*\{/m, "const parser = {") +
    "\nexport const { SyntaxError, parse } = parser;\nexport default parser;\n";

  fs.writeFileSync(outputPath, wrapped, "utf8");
  console.log(`Successfully generated ${outputPath}`);
}

compilePeg("modelPegParser.pegcoffee", "modelPegParser.js", true);
compilePeg("funcTplParser.pegcoffee", "funcTplParser.js", true);
compilePeg(
  "GridStyleParser.pegjs",
  "GridStyleParser.js",
  false,
  ["axisTemplate", "size", "atomicSize", "numSize", "flexibleSize"]
);

console.log("All PEG parsers built successfully!");
