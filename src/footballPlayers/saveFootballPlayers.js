import _ from "lodash";
import { Commons, FootballPlayer } from "../database";
import { Read } from "../utils";


// -------------------------------------------------------------

const printCorruptedPlayer = (footballPlayer_obj, reason) => {
  console.error(`===== corrupted footballPlayer. Reason: ${reason}. ${JSON.stringify(footballPlayer_obj,null,2)}`)
}

// -------------------------------------------------------------

const containsCorrectData = (footballPlayer_obj) => {

  // all fields must be present
  const mandatoryFields = ["id", "name", "team", "roleClassic", "roleMantra", "actualPrice", "initialPrice"];
  if(!mandatoryFields.every(item => footballPlayer_obj.hasOwnProperty(item))){
    let reason = "Object does not contain mandatory fields"
    printCorruptedPlayer(footballPlayer_obj, reason)
    return false;
  }

  // Check "id"
  if (footballPlayer_obj["id"] < 0){
    let reason = "'id' cannot be < 0"
    printCorruptedPlayer(footballPlayer_obj, reason)
    return false;
  }

  // Check "name"
  if (footballPlayer_obj["name"] === "" || footballPlayer_obj["name"] === null){
    let reason = "'name' cannot be null or empty"
    printCorruptedPlayer(footballPlayer_obj, reason)
    return false;
  }

  // Check "team"
  if (footballPlayer_obj["team"] === "" || footballPlayer_obj["team"] === null){
    let reason = "'team' cannot be null or empty"
    printCorruptedPlayer(footballPlayer_obj, reason)
    return false;
  }

  // Check "roleClassic"
  let roleClassic = footballPlayer_obj["roleClassic"]
  if(roleClassic === null){
    let reason = "'roleClassic' ust be defined"
    printCorruptedPlayer(footballPlayer_obj, reason)
    return false;
  }

  const classicRolesAllowed = ["P", "D", "C", "A"]
  if (!classicRolesAllowed.includes(roleClassic)){
    let reason = "'roleClassic' value not allowed"
    printCorruptedPlayer(footballPlayer_obj, reason)
    return false;
  }
  
  // Check "roleMantra"
  let roleMantra = footballPlayer_obj["roleMantra"]
  if(roleMantra === null){
    let reason = "'roleMantra' must be defined"
    printCorruptedPlayer(footballPlayer_obj, reason)
    return false;
  }

  const mantraRolesAllowed = ["Por", "Dd", "Ds", "Dc", "E", "M", "C", "W", "T", "A", "Pc"]  
  roleMantra.forEach(mantraRole => {
    if (!mantraRolesAllowed.includes(mantraRole)){
      let reason = "'roleMantra' value not allowed"
      printCorruptedPlayer(footballPlayer_obj, reason)
      return false;
    }
  })

  // Check "actualPrice"
  if (footballPlayer_obj["actualPrice"] < 0){
    let reason = "'actualPrice' cannot be < 0"
    printCorruptedPlayer(footballPlayer_obj, reason)
    return false;
  }

  // Check "initialPrice"
  if (footballPlayer_obj["initialPrice"] < 0){
    let reason = "'initialPrice' cannot be < 0"
    printCorruptedPlayer(footballPlayer_obj, reason)
    return false;
  }

  return true; 
}

// -------------------------------------------------------------

const mergeRoles = (footballPlayerListClassic_obj, footballPlayerListMantra_obj) => {
  let footballPlayerList_obj = {}

  for (const [footballPlayerId, footballPlayerClassic_obj] of Object.entries(footballPlayerListClassic_obj)) {

    let footballPlayerMantra_obj = footballPlayerListMantra_obj[footballPlayerId]

    // merge roles
    let footballPlayer_obj = footballPlayerClassic_obj
    footballPlayer_obj["roleMantra"] = footballPlayerMantra_obj["roleMantra"]

    // add to object
    if (containsCorrectData(footballPlayer_obj)){
      footballPlayerList_obj[footballPlayerId] = footballPlayer_obj;
    }
  }

  return footballPlayerList_obj
}

// -------------------------------------------------------------

const getPlayersFromExcelContent = (excelContent_obj, isMantra) => {
  
  let footballPlayerList_obj = {};

  excelContent_obj.forEach( (footballPlayer) => {

    let footballPlayerId = footballPlayer["Id"];

    // Create footballPlayer object
    let footballPlayer_obj = {
      id: footballPlayerId,
      name: footballPlayer["Nome"],
      team: footballPlayer["Squadra"],
      roleClassic: isMantra ? null : footballPlayer["R"],
      roleMantra: isMantra ? footballPlayer["R"].split(';') : null,
      actualPrice: footballPlayer["Qt. A"],
      initialPrice: footballPlayer["Qt. I"],
    };

    footballPlayerList_obj[footballPlayerId] = footballPlayer_obj;
  });

  return footballPlayerList_obj;
};

// -------------------------------------------------------------

const saveFootballPlayerWithVersion = async (footballPlayerList_obj, version) => {

  let footballPlayer = FootballPlayer({
    footballPlayers: footballPlayerList_obj,
    version: version,
  });

  try {
    await footballPlayer.save();
  } catch (error) {
    console.error(error);
  }
}

// -------------------------------------------------------------

const saveFootballPlayers = async (excelFilenameClassic, excelFilenameMantra) => {
  
  // use to measure execution time
  let start = process.hrtime()

  // Excel file to Json object
  let excelContentClassic_obj = Read(excelFilenameClassic, 1);
  let excelContentMantra_obj = Read(excelFilenameMantra, 1);

  // Extract footballPlayer from Json object
  let footballPlayerListClassic_obj = getPlayersFromExcelContent(excelContentClassic_obj, false);
  let footballPlayerListMantra_obj = getPlayersFromExcelContent(excelContentMantra_obj, true);

  // Merge Classic and Mantra roles
  let footballPlayerList_obj = mergeRoles(footballPlayerListClassic_obj, footballPlayerListMantra_obj)

  // Fetch last version of FootballPlayer collection from DB
  let footballPlayerListOld_obj = null;
  try {
    footballPlayerListOld_obj = await FootballPlayer.get();
  } catch (error) {
    console.error(error);
  }

  // There is already a FootballPlayer collection version in the DB
  if (footballPlayerListOld_obj && footballPlayerListOld_obj.footballPlayers) {

    let versionOld = footballPlayerListOld_obj.version

    // Check if an update is needed
    let equals = _.isEqual(footballPlayerListOld_obj.footballPlayers,footballPlayerList_obj);
    if (!equals) {
      console.log(`FootballPlayer collection has to be updated`);

      try {
        console.log(`deleting FootballPlayer collection version: ${versionOld}`);
        let status = await FootballPlayer.delete();
        //console.log(`delete FootballPlayer status: ${JSON.stringify(status, null, 2)}`);
      } catch (error) {
        console.error(error);
      }
      
      // save new version of FootballPlayer collection
      saveFootballPlayerWithVersion(footballPlayerList_obj, ++versionOld)
    }
    else{
      console.log(`FootballPlayer collection is up to date. Current version: ${versionOld}`);
    }
  }

  // save footballPlayers collection for the first time
  else {
    console.log(`creation of FootballPlayer collection`);
    saveFootballPlayerWithVersion(footballPlayerList_obj, 1)
  }
  
  let end = process.hrtime(start)  
  console.info(`saveFootballPlayers() execution time: ${end[0]}s ${end[1] / 1000000}ms`)
};

export { saveFootballPlayers };
