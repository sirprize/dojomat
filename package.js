var profile = (function (){

    var miniExcludes = {
            "LICENSE": 1,
            "dispatched/package": 1,
            "dispatched/package.json": 1,
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