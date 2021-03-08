import chai from 'chai';
import chaiHttp from 'chai-http'
import config from 'config'
import { initMongoConnection } from '../../src/database/index.js'

const serverUrl = config.serverUrl || "http://localhost:3000";

chai.use(chaiHttp);

initMongoConnection()

export const requester = chai.request(serverUrl)
