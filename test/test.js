var Lab = require('lab');
var lab = exports.lab = Lab.script();
var sinon = require('sinon');
var rewire = require('rewire');

var auditPackage = rewire('./../lib/auditPackage');
var fixtures = require('./data/fixtures');
var suite = lab.suite;
var before = lab.before;
var after = lab.after;
var assert = Lab.assert;
var it = lab.it;


suite('auditPackage', { timeout: 30000 }, function () {
    var validateStub;
    var sandbox = sinon.sandbox.create();

    before(function (done) {
        validateStub = sandbox.stub();

        validateStub.withArgs('qs').yields(null, fixtures['qs@0.5.x']);
        validateStub.yields(null, []);

        auditPackage.__set__('validateModule', validateStub);
        done();
    });

    after(function (done) {
        sandbox.restore();
        done();
    });

    it('should return a list of advisory for a vulnerable package', function (done) {
        auditPackage('test/data/vulnerable-package.json', function (err, results) {
            var qs = fixtures.qsVulnerabilityResponse;

            assert.ifError(err);
            assert.equal(2, results.length);
            assert.deepEqual(results, qs);

            done();
        });
    });

    it('should return a valid list of ancestors', function (done) {
        auditPackage('test/data/transitive-dependency.json', function (err, results) {
            var ancestry = ['root@0.0.1', 'couchbase@1.2.2', 'request@2.30.0', 'qs@0.6.6'];
            assert.ifError(err);
            assert.equal(1, results.length);
            assert.deepEqual(ancestry, results[0].dependencyOf);

            done();
        });
    });

    it('should return an empty result list with git dependencies', function (done) {
        validateStub.returns([]);

        auditPackage('test/data/git-deps-package.json', function (err, results) {
            assert.ifError(err);
            assert.equal(0, results.length);

            done();
        });
    });
});
