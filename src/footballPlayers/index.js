
import { RecurrenceRule, scheduleJob } from 'node-schedule'
import config from 'config'
import axios from 'axios'
import { read } from 'xlsx'
import moment from 'moment'
import fs from 'fs'
const cheerio = require('cheerio');

import { saveFootballPlayers } from './saveFootballPlayers'

const JobSchedule = () =>
{
    let rule = new RecurrenceRule()
    rule.hour = config.schedule && config.schedule.hour || 3      //ora del giorno in cui schedulare il job

    scheduleJob( rule, downloadPlayers )
}

const extractUrl = (str) => {

    // remove spaces and new lines
    const regex_spaces_and_newlines = /(\r\n|\n|\r|\s)/gm
    let clean_str = str.replace(regex_spaces_and_newlines, "")

    // extract url
    // const regex_location_href = /.*location.href="\/\/([^\n\r]*)"\}\);/m
    const regex_timestamp = /.*location.href=".*\=([^\n\r]*)"\}\);/m
    const url = clean_str.match(regex_timestamp)[1]

    return url
}

const extract_timestamp = async () => {
    try
    {
        let html = await axios.get("https://www.fantacalcio.it/quotazioni-fantacalcio")
        console.log("=========")
        // console.log(html)
        console.log("=========")
        const parsedHTML = cheerio.load(html.data);

        // let class_name = ".role"
        // console.log(parsedHTML(class_name).length);
        // console.log(parsedHTML(class_name));
        // console.log("===================")

        let script_name = "script"
        // console.log(parsedHTML(script_name).length);
        // console.log(parsedHTML(script_name));
        // console.log("===================")

        const script = parsedHTML(script_name).get()[31].children[0].data

        return Promise.resolve(extractUrl(script))

    }
    catch (error)
    {
        console.error(error)
    }
    return Promise.resolve(null)
}

const downloadPlayers = async () =>
{
    console.log("downloadPlayers()")

    const timestamp = await extract_timestamp()
    console.log(`timestamp = ${timestamp}`)

    const classicUrl = config.schedule.classicUrl + timestamp
    console.log(`classicUrl = ${classicUrl}`)
    const classicFilename = config.schedule.excelFilenameClassic

    let classicFile = await downloadList( classicUrl, classicFilename )

    const mantraUrl = config.schedule.mantraUrl + timestamp
    console.log(`mantraUrl = ${mantraUrl}`)
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