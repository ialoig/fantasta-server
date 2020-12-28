
import { RecurrenceRule, scheduleJob } from 'node-schedule'
import config from 'config'

import { savePlayersJson } from './savePlayersJson'

const JobSchedule = () =>
{
    let rule = new RecurrenceRule()
    rule.hour = config.schedule && config.schedule.hour || 3      //ora del giorno in cui schedulare il job

    scheduleJob( rule, () => { savePlayersJson() } )
}

JobSchedule()

export { savePlayersJson }
