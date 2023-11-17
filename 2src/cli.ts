#!/usr/bin/env node

import { program } from 'commander';
import packageJson from '../package.json'; // Adjust the path as necessary

// Import your functions

import { readXSpaceConfig } from './utils';
import { build, install, runScript } from './commands';

program.version(packageJson.version);

program
    .command('install')
    .description('Install dependencies for all workspaces')
    .option('--frozen-lockfile', 'Don\'t generate a lockfile and fail if an update is needed')
    .action(async (options) => {
        const packageFiles = await readXSpaceConfig();
        await install(packageFiles, options.frozenLockfile ? ['--frozen-lockfile'] : []);
    });

program
    .command('build')
    .description('Build all workspaces')
    .action(async () => {
        const packageFiles = await readXSpaceConfig();
        await build(packageFiles, []);
    });

program
    .command('run <script>')
    .description('Run a script in all workspaces')
    .action(async (script) => {
        const packageFiles = await readXSpaceConfig();
       runScript(packageFiles, script, []);
    });

program
    .command('workspace <name> install')
    .description('Install dependencies for a specific workspace')
    .action(async (name) => {
        await executeInSingleWorkspace(name, 'install');
    });

program
    .command('workspace <name> build')
    .description('Build a specific workspace')
    .action(async (name) => {
        await executeInSingleWorkspace(name, 'build');
    });

program
    .command('workspace <name> run <script>')
    .description('Run a script in a specific workspace')
    .action(async (name, script) => {
        await executeInSingleWorkspace(name, 'run', script);
    });

program.parse(process.argv);
