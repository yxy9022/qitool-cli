const chalk = require('chalk');
// const { stopSpinner } = require('../utils/spinner');
const { log } = require('../utils/logger');
// const inquirer = require('inquirer');

async function create(name, options) {
  log();
  log(`✨  You executed the ${chalk.yellow('demo')} command, the name is ${chalk.yellow(name)}.`);
  log();
}

module.exports = (...args) => {
  return create(...args).catch(err => {
    // stopSpinner(false); // do not persist
    console.error(err);
    process.exit(1);
  });
};
