import chalk from 'chalk';
import { trackingMessage } from './tracking';
import { Contract, Frontend, FrontendMessage, ProjectName } from './types';

if (process.env.NEAR_NO_COLOR) {
  chalk.level = 0;
}

export const show = (...args: unknown[]) => console.log(...args);

export const welcome = () =>
  show(chalk`
{blue ======================================================}
👋 {bold {green Welcome to Near!}} Learn more: https://docs.near.org/
🔧 Let's get your project ready.
{blue ======================================================}
(${trackingMessage})\n`);

export const setupFailed = () =>
  show(chalk`{bold {red ==========================================}}
{red ⛔️ There was a problem during the project setup}.
Please refer to https://github.com/near/create-near-app README to troubleshoot.
Notice: some platforms aren't supported (yet).
{bold {red ==========================================}}`);

const mapContractLanguage = (contract: Contract) => {
  switch (contract) {
    case 'ts':
      return 'Typescript';
    case 'rs':
      return 'Rust';
    case 'py':
      return 'Python';
    default:
      return '';
  }
};

export const successContractToText = (contract: Contract) =>
  contract === 'none'
    ? ''
    : chalk`a smart contract in {bold ${mapContractLanguage(contract)}}`;

const frontendTemplates: FrontendMessage = {
  'next-page': 'NextJS (Classic)',
  'next-app': 'NextJS (App Router)',
  'vite-react': 'Vite React'
};

export const successFrontendToText = (frontend: Frontend) =>
  frontend === 'none'
    ? ''
    : chalk`a web-app using ${frontendTemplates[frontend]}`;

export const setupSuccess = (
  projectName: ProjectName,
  contract: Contract,
  frontend: Frontend,
  install: boolean,
  needsToInstallCargoNear: boolean
) =>
  show(chalk`
✅ Success! Created '${projectName}', ${successContractToText(
  contract
)}${successFrontendToText(frontend)}.
${
  contract === 'rs'
    ? chalk`🦀 If you are new to Rust please visit {bold {green https://www.rust-lang.org }}\n`
    : ''
}
{bold {bgYellow {black Next steps}}}:
${contractInstructions(projectName, contract, install, needsToInstallCargoNear)}${gatewayInstructions(
  projectName,
  frontend,
  install
)}`);

export const contractInstructions = (
  projectName: ProjectName,
  contract: Contract,
  install: boolean,
  needsToInstallCargoNear: boolean
) => {
  if (contract === 'none') {
    return '';
  }

  let message = '';

  if (needsToInstallCargoNear) {
    message += chalk`   - {inverse Install cargo-near}:
         {blue Go to {bold https://github.com/near/cargo-near}}\n`;
  }

  message += chalk`   - {inverse Navigate to your project}:
         {blue cd {bold ${projectName}}}\n`;

  if (contract === 'ts' && !install) {
    message += chalk`   - {inverse Install all dependencies}
         {blue npm {bold install}}\n`;
  }

  message += chalk`   - {inverse Build your contract}:\n`;

  if (contract === 'ts') {
    message += chalk`         {blue npm {bold run build}}\n`;
  } else if (contract === 'py') {
    message += chalk`         {blue {bold uvx nearc contract.py --create-venv}}\n`;
  } else {
    message += chalk`         {blue {bold cargo near build}}\n`;
  }

  message += chalk`   - {inverse Test your contract} in the Sandbox:\n`;

  if (contract === 'ts') {
    message += chalk`         {blue npm {bold run test}}\n`;
  } else if (contract === 'py') {
    message += chalk`         {blue {bold uv run pytest}}\n`;
  } else {
    message += chalk`         {blue {bold cargo near test}}\n`;
  }
  
  message += chalk`\n🧠 Read {bold {greenBright README.md}} to explore further`;

  return message;
};

export const gatewayInstructions = (
  projectName: ProjectName,
  frontend: Frontend,
  install: boolean
) =>
  frontend === 'none'
    ? ''
    : chalk`
   - {inverse Navigate to your project}:
         {blue cd {bold ${projectName}}}
${
  !install
    ? chalk`   - {inverse Install all dependencies}
         {blue npm {bold install}}`
    : 'Then:'
}
   - {inverse Start your app}:
         {blue npm {bold run dev}}`;

export const argsError = (msg: string) =>
  show(chalk`{red Arguments error: {white ${msg}}}

Run {blue npx create-near-app} without arguments, or use:
npx create-near-app <projectName> [--frontend next-app|next-page] [--contract rs|ts|none]`);

export const unsupportedNodeVersion = (supported: string) =>
  show(chalk`{red We support node.js version ${supported} or later}`);

export const windowsWarning = () =>
  show(chalk`{red Please use Windows Subsystem for Linux (WSL) to develop smart contracts}
{yellow Learn more here: https://docs.near.org/blog/getting-started-on-windows}
`);

export const directoryExists = (dirName: string) =>
  show(chalk`{red This directory already exists! ${dirName}}`);

export const creatingApp = () => show(chalk`\n- Creating a new {bold NEAR dApp}...`);

// Installing dependencies messages
export const depsInstall = () =>
  show(chalk`- Installing dependencies in a few folders, this might take a while...`);

export const depsInstallError = () =>
  show(chalk.red('Error installing NEAR project dependencies'));

// Updating files messages
export const updatingFiles = () => show(chalk`- Updating Cargo.toml and rust-toolchain.toml files from the remote source...`);
export const updateFilesFailed = () => show(chalk`  {yellow There was a problem during the Cargo.toml and rust-toolchain.toml files remote updating. Check your internet connection.}\n`);

// Checking cargo-near messages
export const checkingCargoNear = () => show(chalk`- Checking if cargo-near extension is installed...`);
export const cargoNearIsNotInstalled = () => show(chalk`  {bold {yellow Did not find cargo-near, please install it to build and deploy Rust contracts: https://github.com/near/cargo-near}}`);