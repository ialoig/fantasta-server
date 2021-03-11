import chai from 'chai';
import chaiHttp from 'chai-http'
import config from 'config'
import { initMongoConnection } from '../../src/database/index.js'

const serverUrl = config.serverUrl || "http://localhost:3000";

chai.use(chaiHttp);

initMongoConnection()

export const requester = chai.request(serverUrl)

/**
 * Recursive function to look for a specific value of a property in a nested object (NOTE: an array is an object)
 * @param {*} obj      : object to parse
 * @param {*} property : property to be looked up
 * @param {*} value    : expected value for property
 */
export const findPropertyValueInNestedObject = (obj, property, value) => {
    if( obj[property] === value ){
      return true;
    }
    
    let found = false
    let prop; 
    for (prop in obj) {
        if( obj.hasOwnProperty(prop) && typeof obj[prop] === 'object' ) {
            found = findPropertyValueInNestedObject(obj[prop], property, value);
            if(found){
                return found;
            }
        }
    }
    return found;
}