
import "regenerator-runtime/runtime.js"
import { request, should, use } from 'chai'
import chaiHttp from 'chai-http'
import config from 'config'

const serverUrl = config.serverUrl || "http://localhost:3000";

use(chaiHttp);
should();

export const requester = request(serverUrl)