
import { RecurrenceRule, scheduleJob } from 'node-schedule'
import config from 'config'
import axios from 'axios'
import { read } from 'xlsx'
import moment from 'moment'
import fs from 'fs'

import { saveFootballPlayers } from './saveFootballPlayers'

const JobSchedule = () =>
{
    let rule = new RecurrenceRule()
    rule.hour = config.schedule && config.schedule.hour || 3      //ora del giorno in cui schedulare il job

    scheduleJob( rule, downloadPlayers )
}

const downloadPlayers = async () =>
{
    // const time = moment().subtract(2, 'day').startOf('day').toDate().getTime()
    const time = moment('08:34:55', "hh:mm:ss").toDate().getTime()

    const classicUrl = config.schedule.classicUrl + time // '1614670495000' -> ultimo timestamp buono
    const classicFilename = config.schedule.excelFilenameClassic

    let classicFile = await downloadList( classicUrl, classicFilename )

    const mantraUrl = config.schedule.mantraUrl + time // '1614670495000' -> ultimo timestamp buono
    const mantraFilename = config.schedule.excelFilenameMantra

    let mantraFile = await downloadList( mantraUrl, mantraFilename )

    saveFootballPlayers( classicFile, mantraFile )
}

const downloadList = async ( url, filename ) =>
{
    try
    {
        let response = await axios.get(url, {
            responseType: 'arraybuffer',
            headers: {
              'Accept': 'application/xls'
            }
        })

        let buffer = Buffer.from(response.data);

        const workbook = read(buffer)

        return Promise.resolve(workbook)
    }
    catch (error)
    {
        console.error(error)
    }
    return Promise.resolve(null)
}

JobSchedule()

export { downloadPlayers }

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