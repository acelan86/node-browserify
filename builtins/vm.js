var Script = exports.Script = function NodeScript (code) {
    if (!(this instanceof Script)) return new Script(code);
    this.code = code;
};

Script.prototype.runInNewContext = function (context, name) {
    var iframe = document.createElement('iframe');
    if (!iframe.style) iframe.style = {};
    iframe.style.display = 'none';
    
    document.appendChild(iframe);
    var win = iframe.contentWindow;
    
    var res = win.eval(this.code);
    
    Object.keys(win).forEach(function (acc, key) {
        context[key] = win[key];
    });
    
    return res;
};

Script.prototype.runInThisContext = function () {
    return eval(this.code); // maybe...
};

Script.prototype.runInContext = function (context) {
    // seems to be just runInNewContext on magical context objects which are
    // otherwise indistinguishable from objects except plain old objects
    // for the parameter segfaults node
    return this.runInNewContext(context);
};

Object.keys(Script.prototype).forEach(function (name) {
    exports[name] = Script[name] = function (code) {
        var s = Script(code);
        return s[name].apply(s, [].slice.call(arguments, 1));
    };
});

exports.createScript = function (code) {
    return exports.Script(code);
};

exports.createContext = Script.createContext = function (context) {
    // not really sure what this one does
    // seems to just make a shallow copy
    return Object.keys(context).reduce(function (acc, key) {
        acc[key] = context[key];
        return acc;
    }, {});
};
