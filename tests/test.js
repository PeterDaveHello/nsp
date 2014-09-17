var assert = require('assert');

var auditPackage = require('./../lib/auditPackage');

auditPackage('tests/data/vulnerable-package.json', function (err, results) {
    var qs = [{
        'module':'qs',
        'version':'0.5.6',
        'advisory':{
            'title':'qs Denial-of-Service Extended Event Loop Blocking',
            'author':'Tom Steele',
            'module_name': 'qs',
            'publish_date': 'Aug 6 2014 09:10:23 GMT-0800 (PST)',
            'cves': [],
            'vulnerable_versions': '<1.0.0',
            'patched_versions': '>= 1.x',
            'url': 'qs_dos_extended_event_loop_blocking'
        },
        'dependencyOf': ['test@0.0.1','qs@0.5.6']
    }];

    assert.ifError(err);
    console.log('FIRST',results);
    assert.equal(1, results.length);
    assert.deepEqual(qs, results);
});

// auditPackage('tests/data/dependency-of-package.json', function (err, results) {
//     var ancestry = ['root@0.0.1','winston-email@0.0.6','winston@0.7.3','request@2.16.6','qs@0.5.6'];

//     assert.ifError(err);
//     console.log('SECOND',results);
//     assert.equal(1, results.length);
//     assert.deepEqual(ancestry, results[0].dependencyOf);
// });

auditPackage('tests/data/git-deps-package.json', function (err, results) {
    assert.ifError(err);
    assert.equal(0, results.length);
});
