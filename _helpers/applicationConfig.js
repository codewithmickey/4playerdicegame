const fs = require('fs');

const Util = require('./utils');

const COURSE_REPOSITORY_TEMP = "./courserepositorytemp";
const COURSE_REPOSITORY = "./courserepository";
const USER_TEMP_REPOSITORY = "./userdata/temp";


function createAllDirectory(){
    
}

module.exports = {
    createAllDirectory:createAllDirectory,
    COURSE_REPOSITORY_TEMP:COURSE_REPOSITORY_TEMP,
    COURSE_REPOSITORY:COURSE_REPOSITORY,
    USER_TEMP_REPOSITORY:USER_TEMP_REPOSITORY
}