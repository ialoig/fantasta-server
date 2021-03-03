
import { RecurrenceRule, scheduleJob } from 'node-schedule'
import config from 'config'
import axios from 'axios'
import { read } from 'xlsx'
import { load } from 'cheerio'

import { saveFootballPlayers } from './saveFootballPlayers'

const JobSchedule = () =>
{
    let rule = new RecurrenceRule()
    rule.hour = config.schedule && config.schedule.hour || 3      //ora del giorno in cui schedulare il job

    scheduleJob( rule, downloadPlayers )
}

const downloadPlayers = async () =>
{
    console.log("downloadPlayers()")

    const timestamp = await getQuotesTimestamp()
    console.log(`timestamp = ${timestamp}`)

    const classicUrl = config.schedule.classicUrl + timestamp
    let classicFile = await downloadList( classicUrl )

    const mantraUrl = config.schedule.mantraUrl + timestamp
    let mantraFile = await downloadList( mantraUrl )

    const statisticTimestamp = await getStatisticsTimestamp()
    const statisticsUrl = config.schedule.statistiche + statisticTimestamp
    let statisticFile = await downloadList( statisticsUrl )

    saveFootballPlayers( classicFile, mantraFile, statisticFile )
}

JobSchedule()

export { downloadPlayers }

const getQuotesTimestamp = async () =>
{
    let data = await getDataFromHtml( "https://www.fantacalcio.it/quotazioni-fantacalcio" )
    
    const timestamp = data ? extractQuotesTimestamp(data) : ''

    return Promise.resolve(timestamp)
}

const extractQuotesTimestamp = (str) => {

    // remove spaces and new lines
    const regex_spaces_and_newlines = /(\r\n|\n|\r|\s)/gm
    let clean_str = str.replace(regex_spaces_and_newlines, "")

    let url_str = clean_str.substring( clean_str.indexOf("href=\"")+6, clean_str.lastIndexOf("\"") )

    // extract url
    // const regex_location_href = /.*location.href="\/\/([^\n\r]*)"\}\);/m
    // const regex_timestamp = /.*location.href=".*\=([^\n\r]*)"\}\);/m
    // const regex_timestamp = /t=([^\n\r]*)/m
    const regex_digt = /t=([\d]*)/m

    return url_str.match(regex_digt) && url_str.match(regex_digt)[1] || ''
}

const getStatisticsTimestamp = async () =>
{
    let data = await getDataFromHtml( "https://www.fantacalcio.it/statistiche-serie-a" )
        
    const timestamp = data ? extractStatisticsTimestamp(data) : ''

    return Promise.resolve(timestamp)
}

const extractStatisticsTimestamp = (str) =>
{
    const regex_spaces_and_newlines = /(\r\n|\n|\r|\s)/gm
    let clean_str = str.replace(regex_spaces_and_newlines, "")

    let url_str = clean_str.substring( clean_str.indexOf("href=\"")+6, clean_str.indexOf("\"})") )

    const regex_timestamp = /t=([\ds=\-&]*)/m
    
    return url_str.match(regex_timestamp) && url_str.match(regex_timestamp)[1] || ''
}

const getDataFromHtml = async ( url ) =>
{
    let elem = null
    try
    {
        let html = await axios.get( url )
        
        const script_name = "script"
        const parsedHTML = load(html.data)(script_name);

        const parsedNodes = parsedHTML && parsedHTML.get && parsedHTML.get() || null
        
        if ( parsedNodes && parsedNodes.length )
        {
            parsedNodes.find((node) =>
                node.children && node.children.find((child) => {
                    if ( child.data && child.data.toLowerCase().indexOf('servizi/excel') > -1 )
                    {
                        elem = child.data
                    }
                })
            )
        }

    }
    catch (error)
    {
        console.error(error)
    }
    return Promise.resolve(elem || '')
}

const downloadList = async ( url ) =>
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