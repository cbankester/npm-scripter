#!/usr/bin/env node
"use strict";
/**
 * Module dependencies.
 */

var program = require('commander');
var readJSON = require('read-package-json');
var path = require('path');
var child_process = require('child_process');
var chalk_cmd = path.join(__dirname, 'node_modules', '.bin', 'chalk');
var pwd = process.env.PWD;

// get the package.json of the module that included npm-scripter as a dep
readJSON(path.join(pwd, 'package.json'), console.error, (err, data) => {
  if (err) return console.error('There was an error:', err.stack);
  const script_options = data['npm-scripter'];
  const default_announce = script_options.default && script_options.default.announce || {color: null, text: null};
  const default_done = script_options.default && script_options.default.done || {color: null, text: null};
  let scripts = [];

  program
    .version('0.0.1')
    .arguments('<script> [otherScripts...]')
    .action((script, other_scripts) => {
      scripts = [script].concat(other_scripts);
    });

  program.parse(process.argv);

  scripts.forEach(script => {
    const announce = default_announce;
    const done = default_done;
    const opts = script_options[script];
    const commands = [];
    let script_cmd;
    if (opts) {
      script_cmd = opts.command;
      if (!script_cmd) throw new Error(`Script command not defined for ${script}`);
      opts.announce && Object.assign(
        announce,
        (typeof opts.announce === "string") && {text: opts.announce} || opts.announce
      );
      opts.done && Object.assign(
        done,
        (typeof opts.done === "string") && {text: opts.done} || opts.done
      );
    } else script_cmd = script;
    if (announce.text) {
      if (announce.color)
        commands.push([chalk_cmd, announce.color, `'${announce.text}'`]);
      else
        commands.push(['echo', `'${announce.text}'`]);
    }
    commands.push([script_cmd]);
    if (done.text) {
      if (done.color)
        commands.push([chalk_cmd, done.color, `'${done.text}'`]);
      else
        commands.push(['echo', `'${done.text}'`]);
    }
    commands.forEach(cmd => {
      child_process.execSync(cmd[0], cmd.slice(1), {cwd: pwd});
    });
  });
});
