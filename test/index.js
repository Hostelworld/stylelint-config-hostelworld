/* global describe, it, beforeEach */
import fs from 'fs';
import stylelint from 'stylelint';
import config from './..';
import chai from 'chai';
import chaiThings from 'chai-things';
import chaiLike from 'chai-like';

chai.should();
chai.use(chaiLike);
chai.use(chaiThings);

const expect = chai.expect;

const validCss = fs.readFileSync('./test/css-valid.scss', 'utf-8');
const invalidCss = fs.readFileSync('./test/css-invalid.scss', 'utf-8');

describe('flags no warnings with valid css', () => {
    let result;

    beforeEach(() => {
        result = stylelint.lint({
            code: validCss,
            config
        });
    });

    it('did not error', () => {
        return result.then(data => (
            expect(data.errored).to.be.false
        ));
    });

    it('flags no warnings', () => {
        return result.then(data => (
            expect(data.results[0].warnings.length).to.equal(0)
        ));
    });
});

describe('flags warnings with invalid css', () => {
    let result;

    beforeEach(() => {
        result = stylelint.lint({
            code: invalidCss,
            config
        });
    });

    it('did error', () => {
        return result.then(data => (
            expect(data.errored).to.be.true
        ));
    });

    it('flags four errors', () => {
        return result.then(data => (
            expect(data.results[0].warnings.length).to.equal(5)
        ));
    });

    it('correct warning text', () => {
        return result.then(data => {
            expect(data.results[0].warnings).to.be.an('array').that.contains.something.like({ text: 'Expected indentation of 4 spaces (indentation)' });
            expect(data.results[0].warnings).to.be.an('array').that.contains.something.like({ text: 'Expected class selector in kebab-case naming format (selector-class-pattern)' });
            expect(data.results[0].warnings).to.be.an('array').that.contains.something.like({ text: 'Expected a leading zero (number-leading-zero)' });
            expect(data.results[0].warnings).to.be.an('array').that.contains.something.like({ text: 'Expected newline after "," (selector-list-comma-newline-after)' });
            expect(data.results[0].warnings).to.be.an('array').that.contains.something.like({ text: 'Expected $ variable to be kebab-case (scss/dollar-variable-pattern)' });
        });
    });

    it('correct rule flagged', () => {
        return result.then(data => {
            expect(data.results[0].warnings).to.be.an('array').that.contains.something.like({ rule: 'indentation' });
            expect(data.results[0].warnings).to.be.an('array').that.contains.something.like({ rule: 'selector-class-pattern' });
            expect(data.results[0].warnings).to.be.an('array').that.contains.something.like({ rule: 'number-leading-zero' });
            expect(data.results[0].warnings).to.be.an('array').that.contains.something.like({ rule: 'selector-list-comma-newline-after' });
            expect(data.results[0].warnings).to.be.an('array').that.contains.something.like({ rule: 'scss/dollar-variable-pattern' });
        });
    });

    it('correct severity flagged', () => {
        return result.then(data => {
            expect(data.results[0].warnings[0].severity).to.equal('error');
            expect(data.results[0].warnings[1].severity).to.equal('error');
            expect(data.results[0].warnings[2].severity).to.equal('error');
            expect(data.results[0].warnings[3].severity).to.equal('error');
        });
    });
});
