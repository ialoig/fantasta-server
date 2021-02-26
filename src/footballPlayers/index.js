
import { RecurrenceRule, scheduleJob } from 'node-schedule'
import config from 'config'

import { saveFootballPlayers } from './saveFootballPlayers'

const JobSchedule = () =>
{
    let rule = new RecurrenceRule()
    rule.hour = config.schedule && config.schedule.hour || 3      //ora del giorno in cui schedulare il job

    scheduleJob( rule, savePlayers )
}

const savePlayers = () =>
{
    saveFootballPlayers(config.schedule.excelFilenameClassic, config.schedule.excelFilenameMantra)
}

JobSchedule()
savePlayers()
