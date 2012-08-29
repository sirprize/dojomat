var profile = (function (){

    var miniExcludes = {
            "LICENSE": 1,
            "dojomat/package": 1,
            "dojomat/package.json": 1,
            "readme.md": 1
        }
    ;

    return {
        resourceTags: {
            miniExclude: function (filename, moduleId) {
                return moduleId in miniExcludes;
            },

            amd: function (filename, moduleId) {
                return /\.js$/.test(filename);
            }
        }
    };
})();