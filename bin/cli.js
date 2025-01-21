#!/usr/bin/env node

// Check node version before requiring/doing anything else
// The user may be on a very old node version
const chalk = require('chalk');
const semver = require('semver');
const requiredVersion = require('../package.json').engines.node;
const leven = require('leven');

function checkNodeVersion(wanted, id) {
  if (!semver.satisfies(process.version, wanted, { includePrerelease: true })) {
    /* prettier-ignore */
    console.log(chalk.red(
      'You are using Node ' + process.version + ', but this version of ' + id +
      ' requires Node ' + wanted + '.\nPlease upgrade your Node version.'
    ))
    process.exit(1);
  }
}

const minimist = require('minimist');

checkNodeVersion(requiredVersion, 'qitool-cli');

const program = require('commander');

program.version(`qitool-cli ${require('../package').version}`).usage('<command> [options]');

// just a demo
program
  .command('demo <name>')
  .description('An example to describe your command execution powered by qitool-cli')
  .action((name, options) => {
    if (minimist(process.argv.slice(3))._.length > 1) {
      /* prettier-ignore */
      console.log(chalk.yellow('\n Info: You provided more than one argument. The first one will be used as the app\'s name, the rest are ignored.'))
    }
    require('../lib/demo')(name, options);
  });

program
  .command('decode <str>')
  .description('decode b64_2 data')
  .action((str, options) => {
    require('../lib/decode')(str, options);
  });

// output help information on unknown commands
program.on('command:*', ([cmd]) => {
  program.outputHelp();
  console.log(`  ` + chalk.red(`Unknown command ${chalk.yellow(cmd)}.`));
  console.log();
  suggestCommands(cmd);
  process.exitCode = 1;
});

// add some useful info on help
program.on('--help', () => {
  console.log();
  console.log(`  Run ${chalk.cyan(`tool <command> --help`)} for detailed usage of given command.`);
  console.log();
});

program.commands.forEach(c => c.on('--help', () => console.log()));

program.parse(process.argv);

function suggestCommands(unknownCommand) {
  const availableCommands = program.commands.map(cmd => cmd._name);

  let suggestion;

  availableCommands.forEach(cmd => {
    const isBestMatch = leven(cmd, unknownCommand) < leven(suggestion || '', unknownCommand);
    if (leven(cmd, unknownCommand) < 3 && isBestMatch) {
      suggestion = cmd;
    }
  });

  if (suggestion) {
    console.log(`  ` + chalk.red(`Did you mean ${chalk.yellow(suggestion)}?`));
  }
}
