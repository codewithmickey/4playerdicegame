const fs = require('fs');

/**
 * @param {Directory path} path 
 */
function createDirectory(path) {
    //console.log("createDirectory > path : ",path);
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
    }
}


function isexists(path) {
    
    if (fs.existsSync(path)) {
        return true;
    }

    return false
}



/**
 * @param {Directory path} path 
 */
function deleteDirectory(path) {
    //console.log("deleteDirectory > path : ",path);
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function (file, index) {
            var curPath = path + "/" + file;
            if (fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
}

module.exports = {
    createDirectory: createDirectory,
    deleteDirectory: deleteDirectory,
    isexists:isexists
}