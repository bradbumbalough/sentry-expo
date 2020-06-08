const fs = require('fs');
const rimraf = require('rimraf');
const mkdirp = require('mkdirp');
const spawnAsync = require('@expo/spawn-async');
const sentryCliBinary = require('@sentry/cli');

const uploadSourcemaps = require('../upload-sourcemaps');

jest.mock('fs');
jest.mock('rimraf');
jest.mock('mkdirp');
jest.mock('@sentry/cli');
jest.mock('@expo/spawn-async');

const mockedLog = jest.fn();

const testCliPath = 'your_path/to_sentry/cli';
const spawnOptions = {
  cwd: './.tmp/sentry',
  env: {}
}
sentryCliBinary.getPath.mockReturnValue(testCliPath);

describe("upload-sourcemaps.js", () => {
  let options; 
  
  beforeEach(() => {
    spawnAsync.mockClear();

    options = {
    projectRoot: './__tests__',
    log: mockedLog,
    iosManifest: {
      revisionId: 'test-release'
    },
    iosBundle: 'iosBundle',
    androidBundle: 'androidBundle'
  }
  });

  test('should use global cli when provided', () => {
    options.config = {useGlobalSentryCli: true};
    uploadSourcemaps(options);
    expect(spawnAsync).toHaveBeenCalledWith('sentry-expo',[], spawnOptions);
  })

  test('should use local package by default', () => {
    uploadSourcemaps(options);
    expect(spawnAsync).toHaveBeenCalledWith(testCliPath, [], spawnOptions);
  })

  test('should write bundles to temp directory', () => {
    uploadSourcemaps(options);
    expect(spawnAsync).toHaveBeenCalledWith(testCliPath, [], spawnOptions);
  })

  // it('should set commits with config', () => {
  //   uploadSourcemaps({
      
  //   })
  // })
});