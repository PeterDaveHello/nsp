var assert = require('assert');
var sinon = require('sinon');
var rewire = require('rewire');

var auditPackage = rewire('./../lib/auditPackage');
var fixtures = require('./data/fixtures');

describe('auditPackage', function () {
    var validateStub;
    var sandbox = sinon.sandbox.create();

    before(function () {
        validateStub = sandbox.stub();

        validateStub.withArgs('qs').yields(null, fixtures['qs@0.5.x']);
        validateStub.yields(null, []);

        auditPackage.__set__('validateModule', validateStub);
    });

    after(function () {
        sandbox.restore();
    });

    it('should return a list of advisory for a vulnerable package', function (done) {
        auditPackage('tests/data/vulnerable-package.json', function (err, results) {
            var qs = fixtures.qsVulnerabilityResponse;

            assert.ifError(err);
            assert.equal(2, results.length);
            assert.deepEqual(qs, results);

            done();
        });
    });

    it('should return a valid list of ancestors', function (done) {
        auditPackage('tests/data/transitive-dependency.json', function (err, results) {
            var ancestry = ['root@0.0.1', 'couchbase@1.2.2', 'request@2.30.0', 'qs@0.6.6'];
            assert.ifError(err);
            assert.equal(1, results.length);
            assert.deepEqual(ancestry, results[0].dependencyOf);

            done();
        });
    });

    it('should return an empty result list with git dependencies', function (done) {
        validateStub.returns([]);

        auditPackage('tests/data/git-deps-package.json', function (err, results) {
            assert.ifError(err);
            assert.equal(0, results.length);

            done();
        });
    });
});
