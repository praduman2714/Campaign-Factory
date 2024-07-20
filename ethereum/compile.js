const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

/**
 * Flow for the compile file:
 * Delete the existing build file.
 * Read Campaign.sol from the contracts folder.
 * Compile both contract and Solidity compiler.
 * Write the output to the build directory.
 */

const buildPath = path.resolve(__dirname, "build");
fs.removeSync(buildPath);

const campaignPath = path.resolve(__dirname, 'contracts', 'Campaign.sol');
const source = fs.readFileSync(campaignPath, 'utf-8');

const input = {
    language: 'Solidity',
    sources: {
        'Campaign.sol': {
            content: source
        }
    },
    settings: {
        outputSelection: {
            '*': {
                '*': ['*']
            }
        }
    }
};

const output = JSON.parse(solc.compile(JSON.stringify(input)));

if (output.errors) {
    output.errors.forEach(err => {
        console.error(err.formattedMessage);
    });
}

const contracts = output.contracts['Campaign.sol'];

if (!contracts) {
    console.error('Compilation failed. No contracts found.');
    process.exit(1);
}

fs.ensureDirSync(buildPath);

for (let contract in contracts) {
    fs.outputJSONSync(
        path.resolve(buildPath, `${contract}.json`),
        contracts[contract]
    );
}
