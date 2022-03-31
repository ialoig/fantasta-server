import _ from "lodash"
import { FootballPlayers } from "../database"
import { load_footballPlayer_duration_seconds, METRIC_STATUS, secondsFrom } from "../metrics"
import { xlsxUtils } from "../utils"

const classicRolesAllowed = ["P", "D", "C", "A"]
const mandatoryFields = ["id", "name", "team", "roleClassic", "roleMantra", "actualPrice", "initialPrice"]
const mantraRolesAllowed = ["Por", "Dd", "Ds", "Dc", "E", "M", "C", "W", "T", "A", "Pc"]

const containsCorrectData = (footballPlayer_obj) => {
	let reason = ""
	// eslint-disable-next-line no-prototype-builtins
	if (!mandatoryFields.every(item => footballPlayer_obj.hasOwnProperty(item)))  // all fields must be present
	{
		reason = "Object does not contain mandatory fields"
	}
	else if (footballPlayer_obj["id"] < 0)                // Check "id"
	{
		reason = "'id' cannot be < 0"
	}
	else if (!footballPlayer_obj["name"])                 // Check "name"
	{
		reason = "'name' cannot be null or empty"
	}
	else if (!footballPlayer_obj["team"])                 // Check "team"
	{
		reason = "'team' cannot be null or empty"
	}
	else if (!footballPlayer_obj["roleClassic"])          // Check "roleClassic"
	{
		reason = "'roleClassic' must be defined"
	}
	else if (!classicRolesAllowed.includes(footballPlayer_obj["roleClassic"]))    // Check "roleClassic"
	{
		reason = "'roleClassic' value not allowed"
	}
	else if (!footballPlayer_obj["roleMantra"])           // Check "roleMantra"
	{
		reason = "'roleMantra' must be defined"
	}
	else if (!footballPlayer_obj["roleMantra"].every(roleMantra => mantraRolesAllowed.includes(roleMantra)))        // Check "roleMantra"
	{
		reason = "'roleMantra' value not allowed"
	}
	else if (footballPlayer_obj["actualPrice"] < 0)       // Check "actualPrice"
	{
		reason = "'actualPrice' cannot be < 0"
	}
	else if (footballPlayer_obj["initialPrice"] < 0)      // Check "initialPrice"
	{
		reason = "'initialPrice' cannot be < 0"
	}
	else {
		return true
	}

	console.error(`[saveFootballPlayers] corrupted footballPlayers. Reason: ${reason}. ${JSON.stringify(footballPlayer_obj, null, 2)}`)
	return false
}

const mergeRoles = (footballPlayerClassic, footballPlayerMantra) => {
	let footballPlayerList_obj = {}

	for (const [footballPlayerId, footballPlayerClassic_obj] of Object.entries(footballPlayerClassic)) {

		let footballPlayerMantra_obj = footballPlayerMantra[footballPlayerId]

		// merge roles
		let footballPlayer_obj = footballPlayerClassic_obj
		footballPlayer_obj["roleMantra"] = footballPlayerMantra_obj["roleMantra"]

		// add to object
		if (containsCorrectData(footballPlayer_obj)) {
			footballPlayerList_obj[footballPlayerId] = footballPlayer_obj
		}
	}

	return footballPlayerList_obj
}

const getPlayersFromExcelContent = (playersArray, isMantra) => {

	let playersObj = {}

	playersArray.forEach((footballPlayer) => {

		let footballPlayerId = footballPlayer["Id"]

		let footballPlayer_obj = {
			id: footballPlayerId,
			name: footballPlayer["Nome"],
			team: footballPlayer["Squadra"],
			roleClassic: isMantra ? null : footballPlayer["R"],
			roleMantra: isMantra ? footballPlayer["R"].split(";") : null,
			actualPrice: footballPlayer["Qt. A"],
			initialPrice: footballPlayer["Qt. I"],
		}

		playersObj[footballPlayerId] = footballPlayer_obj
	})
	return playersObj
}

const getStatisticsFromExcelContent = (statistics) => {

	let statisticsObj = {}

	statistics.forEach((footballPlayer) => {

		let footballPlayerId = footballPlayer["Id"]

		let playerStatistics = {
			id: footballPlayerId,
			name: footballPlayer["Nome"],
			team: footballPlayer["Squadra"],
			role: footballPlayer["R"],
			amm: footballPlayer["Amm"],
			asf: footballPlayer["Asf"],
			ass: footballPlayer["Ass"],
			au: footballPlayer["Au"],
			esp: footballPlayer["Esp"],
			gf: footballPlayer["Gf"],
			gs: footballPlayer["Gs"],
			mf: footballPlayer["Mf"],
			mv: footballPlayer["Mv"],
			pg: footballPlayer["Pg"],
			rc: footballPlayer["Rc"],
			rp: footballPlayer["Rp"],
			"r-": footballPlayer["R-"],
			"r+": footballPlayer["R+"]
		}

		statisticsObj[footballPlayerId] = playerStatistics
	})
	return statisticsObj
}

const saveFootballPlayerWithVersion = async (list, statistics, version) => {

	let footballPlayers = FootballPlayers({
		list: list,
		statistics: statistics,
		version: version,
	})

	try {
		await footballPlayers.save()
	}
	catch (error) {
		console.error(`[saveFootballPlayers] error saving FootballPlayers. ${error}`)
	}
}

const saveFootballPlayers = async (classicFile, mantraFile, statisticsFile) => {
	const duration_start = process.hrtime()

	let footballPlayersObj = null
	let statisticsObj = null

	let excelContentClassic = xlsxUtils.readFile(classicFile, 1)
	let excelContentMantra = xlsxUtils.readFile(mantraFile, 1)
	if (excelContentClassic.length && excelContentMantra.length) {
		// Extract footballPlayer from Json object
		let footballPlayerClassic_obj = getPlayersFromExcelContent(excelContentClassic, false)
		let footballPlayerMantra_obj = getPlayersFromExcelContent(excelContentMantra, true)

		footballPlayersObj = mergeRoles(footballPlayerClassic_obj, footballPlayerMantra_obj)
	}

	let excelContent = xlsxUtils.readFile(statisticsFile, 1)
	if (excelContent.length) {
		statisticsObj = getStatisticsFromExcelContent(excelContent)
	}

	if (footballPlayersObj || statisticsObj) {
		try {
			// recupero i giocatori
			let oldTable = await FootballPlayers.findOne()

			let players = oldTable && oldTable.footballPlayers || null
			let statistics = oldTable && oldTable.statistics || null

			if (!_.isEqual(players, footballPlayersObj) || !_.isEqual(statistics, statisticsObj)) {
				if (!_.isEqual(players, footballPlayersObj)) {
					console.log("[saveFootballPlayers] FootballPlayers collection has to be updated")
					players = footballPlayersObj
				}
				else {
					console.log("[saveFootballPlayers] FootballPlayers collection already up to date")
				}

				if (!_.isEqual(statistics, statisticsObj)) {
					console.log("[saveFootballPlayers] Statistics collection has to be updated")
					statistics = statisticsObj
				}
				else {
					console.log("[saveFootballPlayers] Statistics collection already up to date")
				}

				// svuoto la tabella
				await FootballPlayers.deleteMany({})
				saveFootballPlayerWithVersion(players, statistics, new Date().getTime())
			}
			else {
				console.log("[saveFootballPlayers] FootballPlayers collection already up to date")
				console.log("[saveFootballPlayers] Statistics collection already up to date")
			}

			console.info(`[saveFootballPlayers] execution time: ${secondsFrom(duration_start)} seconds`)
			load_footballPlayer_duration_seconds.observe({ status: METRIC_STATUS.SUCCESS, msg: "" }, secondsFrom(duration_start))
		}
		catch (error) {
			console.error(`[saveFootballPlayers] error updating FootballPlayers. ${error}`)
			load_footballPlayer_duration_seconds.observe({ status: METRIC_STATUS.ERROR, msg: error }, secondsFrom(duration_start))
		}
	}
}

export { saveFootballPlayers, containsCorrectData, mergeRoles, getPlayersFromExcelContent }
