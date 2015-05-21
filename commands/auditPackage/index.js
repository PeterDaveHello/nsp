var path = require('path');

var celeri = require('celeri');

var auditPackage = require('./../../lib/auditPackage');
var prettyOutput = require('./../../lib/prettyOutput');

// Command Description

celeri.option({
    command: 'audit-package',
    description: 'audits your package.json against NSP db',
    optional: {
        '--file': 'package.json location'
    }
}, action);

celeri.option({
    command: 'package',
    description: 'alias to audit-package'
}, action);


// Action

function action(data) {
    var p = path.resolve(process.cwd(), data.file || 'package.json');
    console.log('Checking package file: ' + p);
    auditPackage(p,
      function (err, results) {
        if (err) {
            console.error(err);
            process.exit(1);
        }

        // print results
        prettyOutput(results);
    });
}

// Helpers
