const { argv } = require("yargs/yargs")(process.argv.slice(2))
  .usage("Usage: node $0 [options]")
  .example("node $0 -f foo/bar.yaml")
  .alias("f", "inputFile")
  .nargs("f", 1)
  .describe("f", "The path of the input file to be processed.")
  .demandOption(["f"])
  .help("h")
  .alias("h", "help");

const amf = require("amf-client-js");
const fs = require("fs");

if (!fs.existsSync(argv.inputFile)) {
  console.error(`Input file does not exist: ${argv.inputFile}`);
  process.exit(1);
}

const client = amf.OASConfiguration.OAS30().baseUnitClient();

async function main() {
  console.log(`Parsing file://${argv.inputFile}`);

  const parsingResult = await client.parseDocument(`file://${argv.inputFile}`);

  console.log(`parsingResult.conforms: ${parsingResult.conforms}`);
  console.log(`parsingResult.results.length: ${parsingResult.results.length}`);

  parsingResult.results.forEach((res) => {
    console.log(`${res.severityLevel}: ${res.message}`);
  });

  if (!parsingResult.conforms) console.log(parsingResult.toString());

  console.log("--------");
  console.log("Validating");

  const validationResult = await client.validate(parsingResult.baseUnit);

  console.log(`validationResult.conforms: ${validationResult.conforms}`);
  console.log(
    `validationResult.results.length: ${validationResult.results.length}`
  );
  validationResult.results.forEach((res) => {
    console.log(`${res.severityLevel}: ${res.message}`);
  });

  if (!validationResult.conforms) console.log(validationResult.toString());
}

main();
