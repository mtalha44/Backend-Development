const path = require('node:path');
const a = path.basename('/foo/bar/baz/asdf/quux.html');
console.log(a);

// Returns: 'quux.html'

const b = path.basename('/foo/bar/baz/asdf/quux.html', '.html');
console.log(b);
// Returns: 'quux'

const c = path.dirname('/foo/bar/baz/asdf/quux');
console.log(c);
// Returns: '/foo/bar/baz/asdf'
// Returns: '/foo/bar/baz/asdf'