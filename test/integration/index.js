

import { request, use } from 'chai'
import chaiHttp from 'chai-http'
import config from 'config'

const serverUrl = config.serverUrl || "http://localhost:3000";

use(chaiHttp);

export const requester = request(serverUrl)