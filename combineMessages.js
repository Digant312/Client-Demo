const fs = require('fs')
const p = require('path')
const glob = require('glob')
const globSync = glob.sync
const mkdirp = require('mkdirp')
const mkdirpSync = mkdirp.sync

var filePattern = './messages/build/**/*.json';
var outDir = './messages/output/';

// Groups the default messages by namespace that were extracted from the example
// app's React components via the React Intl Babel plugin. An error will be
// thrown if there are messages in the same namespace use the same `id`. The
// result is a collection of namespaced collections of `id: message` pairs for
// the app's default locale, "en-US".
var defaultMessages = globSync(filePattern).map(function (filename) {
  return fs.readFileSync(filename, 'utf8');
}).map(function (file) {
  return JSON.parse(file);
}).reduce(function (collection, descriptors) {
  descriptors.forEach(function (_ref) {
    var id = _ref.id,
        defaultMessage = _ref.defaultMessage;

    if (collection.hasOwnProperty(id)) {
      throw new Error('Duplicate message id: ' + id);
    }
    collection[id] = defaultMessage;
  });

  return collection;
}, {});

mkdirpSync(outDir);

fs.writeFileSync(outDir + 'index.json', `{ "en": ${JSON.stringify(defaultMessages, null, 2)} }`);