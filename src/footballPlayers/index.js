
import { RecurrenceRule, scheduleJob } from 'node-schedule'
import config from 'config'

import { saveFootballPlayers } from './saveFootballPlayers'

const JobSchedule = () =>
{
    let rule = new RecurrenceRule()
    rule.hour = config.schedule && config.schedule.hour || 3      //ora del giorno in cui schedulare il job

    scheduleJob( rule, downloadPlayersScript )
}

/*
const downloadPlayersScript = () =>
{
    const excelFilenameClassic = config.schedule.excelFilenameClassic
    const excelFilenameMantra = config.schedule.excelFilenameMantra

    var options = {
        mode: 'text',
        // pythonPath: 'path/to/python',
        pythonOptions: ['-u'],
        scriptPath: './src/footballPlayers',
        args: [ excelFilenameClassic, excelFilenameMantra ]
      };
      
    PythonShell.run('download_players_list.py', options, function (err, results) {
        if (err)
        {
            console.log('download_players_list.py ERROR: ', err)
            throw err;
        }
        
        saveFootballPlayers(config.schedule.excelFilenameClassic, config.schedule.excelFilenameMantra)
    });
}
*/

// JobSchedule()

// export { downloadPlayersScript }