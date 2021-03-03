
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
    const regex_timestamp_quotation = /&t=([\d]*)/m
    const timestamp = await getTimestamp("https://www.fantacalcio.it/quotazioni-fantacalcio", regex_timestamp_quotation)
    
    const classicUrl = config.schedule.classicUrl + timestamp
    console.log(`[downloadPlayers] classicUrl: ${classicUrl}`)
    const classicFile = await downloadList( classicUrl )

    const mantraUrl = config.schedule.mantraUrl + timestamp
    console.log(`[downloadPlayers] mantraUrl: ${mantraUrl}`)
    const mantraFile = await downloadList( mantraUrl )

    const regex_timestamp_statistics = /&t=([\ds=\-&]*)/m
    const statisticTimestamp = await getTimestamp("https://www.fantacalcio.it/statistiche-serie-a", regex_timestamp_statistics)
    const statisticsUrl = config.schedule.statistiche + statisticTimestamp
    console.log(`[downloadPlayers] statisticsUrl: ${statisticsUrl}`)
    const statisticFile = await downloadList( statisticsUrl )

    saveFootballPlayers( classicFile, mantraFile, statisticFile )
}

const getTimestamp = async (url, regex_timestamp) =>
{
    let data = await getDataFromHtml(url)
    const timestamp = data ? extractTimestamp(data, regex_timestamp) : ''
    return Promise.resolve(timestamp)
}

const extractTimestamp = (str, regex_timestamp) => {

    // remove spaces and new lines
    const regex_spaces_and_newlines = /(\r\n|\n|\r|\s)/gm
    const clean_str = str.replace(regex_spaces_and_newlines, "")

    // extract url
    const regex_url = /(www.*?)(?=")/m // from 'www' up to first occurrence of '"' not included
    const url = clean_str.match(regex_url) && clean_str.match(regex_url)[0] || ''
    console.log(`[downloadPlayers] extracted url: ${url}`)

    // extract timestamp
    return url.match(regex_timestamp) && url.match(regex_timestamp)[1] || ''
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

JobSchedule()

export { downloadPlayers }