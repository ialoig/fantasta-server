import { request, use } from 'chai';
import chaiHttp from 'chai-http'
import config from 'config'
import { initMongoConnection } from '../../src/database/index.js'

const serverUrl = config.serverUrl || "http://localhost:3000";

use(chaiHttp);

initMongoConnection()

export const requester = request(serverUrl)
