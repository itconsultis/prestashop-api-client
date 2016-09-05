import { expect } from 'chai';
import sinon from 'sinon';
import fs from 'fs';
import path from 'path';

global.expect = expect;
global.sinon = sinon;
global.match = sinon.match;
global.spy = sinon.spy;
global.stub = sinon.stub;
global.mock = sinon.mock;

/**
 * @param {String} abspath
 * @return {String}
 */
const readfile = (abspath) => {
  return String(fs.readFileSync(abspath)).trim();
};

const FIXTURE_PATH = path.normalize(path.join(__dirname, 'fixtures'));

/**
 * @param {String} relpath
 * @return {String}
 */
global.fixture = (relpath) => {
  return readfile(path.join(FIXTURE_PATH, relpath));
};

