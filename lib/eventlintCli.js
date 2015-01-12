
var eventlint = require('./eventlint');

eventlint.init({
    exclude: 'test2'
});

eventlint.lint('./lib','\.js(x?)$', function (obj) {
    var output = obj.file + ': ';
    if (obj.type === 'emit') {
        output += 'No listener found for emitted event: ';
    } else {
        output += 'Listener found for non-existing event: ';
    }

    output += obj.handle;

    console.log(output);
});