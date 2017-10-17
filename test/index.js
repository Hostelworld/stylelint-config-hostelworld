/* global describe, it, beforeEach */
import fs from 'fs';
import stylelint from 'stylelint';
import { expect } from 'chai';
import config from './..';

const validCss = fs.readFileSync('./test/css-valid.css', 'utf-8');
const invalidCss = fs.readFileSync('./test/css-invalid.css', 'utf-8');

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

    it('flags three errors', () => {
        return result.then(data => (
            expect(data.results[0].warnings.length).to.equal(3)
        ));
    });

    it('correct warning text', () => {
        return result.then(data => {
            expect(data.results[0].warnings[0].text).to.equal('Expected indentation of 4 spaces (indentation)');
            expect(data.results[0].warnings[1].text).to.equal('Expected a leading zero (number-leading-zero)');
            expect(data.results[0].warnings[2].text).to.equal('Expected newline after "," (selector-list-comma-newline-after)');
        });
    });

    it('correct rule flagged', () => {
        return result.then(data => {
            expect(data.results[0].warnings[0].rule).to.equal('indentation');
            expect(data.results[0].warnings[1].rule).to.equal('number-leading-zero');
            expect(data.results[0].warnings[2].rule).to.equal('selector-list-comma-newline-after');
        });
    });

    it('correct severity flagged', () => {
        return result.then(data => {
            expect(data.results[0].warnings[0].severity).to.equal('error');
            expect(data.results[0].warnings[1].severity).to.equal('error');
            expect(data.results[0].warnings[2].severity).to.equal('error');
        });
    });

    it('correct line number', () => {
        return result.then(data => {
            expect(data.results[0].warnings[0].line).to.equal(2);
            expect(data.results[0].warnings[1].line).to.equal(2);
            expect(data.results[0].warnings[2].line).to.equal(1);
        });
    });

    it('correct column number', () => {
        return result.then(data => {
            expect(data.results[0].warnings[0].column).to.equal(3);
            expect(data.results[0].warnings[1].column).to.equal(8);
            expect(data.results[0].warnings[2].column).to.equal(2);
        });
    });
});
