var celeri = require('celeri');
var path = require('path');
var childProcess = require('child_process');
var nspShrinkwrap = require('nsp-audit-shrinkwrap');
var prettyOutput = require('../../lib/prettyOutput');

celeri.option({
    command: 'audit-global',
    description: 'audits your globally installed modules against NSP db'
}, action);

celeri.option({
    command: 'global',
    description: 'audits your globally installed modules against NSP db (same as audit-global)'
}, action);


function handleAudit(err, results) {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    prettyOutput(results);
}

function handleExec(err, stdout, stderr) {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    if (stderr.length > 0) {
        console.log(stderr.toString());
        process.exit(1);
    }
    nspShrinkwrap.audit(stdout.toString(), handleAudit);
}

function action(data) {
    childProcess.execFile('npm', ['ls', '-g', '--json'], {maxBuffer: 5242880}, handleExec);
}

