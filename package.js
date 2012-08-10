var profile = (function(){

    var miniExcludes = {
            "LICENSE": 1,
            "dojod/package": 1,
            "dojod/package.json": 1,
            "readme.md": 1
        }
    ;

    return {
        resourceTags: {
            miniExclude: function(filename, moduleId) {
                return moduleId in miniExcludes;
            },

            amd: function(filename, moduleId) {
                return /\.js$/.test(filename);
            }
        }
    };
})();