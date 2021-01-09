import _ from "lodash";
import { Commons, FootballPlayer } from "../database";
import { Read } from "../utils";


// -------------------------------------------------------------

const printCorruptedPlayer = (footballPlayer_obj, reason) => {
  console.log(`===== corrupted footballPlayer. Reason: ${reason}. ${JSON.stringify(footballPlayer_obj,null,2)}`)
}

// -------------------------------------------------------------

const containsCorrectData = (footballPlayer_obj) => {

  const mandatoryFields = ["id", "name", "team", "roleClassic", "roleMantra", "actualPrice", "initialPrice"];
  if(!mandatoryFields.every(item => footballPlayer_obj.hasOwnProperty(item))){
    let reason = "Object does not contain mandatory fields"
    printCorruptedPlayer(footballPlayer_obj, reason)
    return false;
  }

  if (footballPlayer_obj["id"] < 0){
    let reason = "'id' cannot be < 0"
    printCorruptedPlayer(footballPlayer_obj, reason)
    return false;
  }
  
  if (footballPlayer_obj["name"] === "" || footballPlayer_obj["name"] === null){
    let reason = "'name' cannot be null or empty"
    printCorruptedPlayer(footballPlayer_obj, reason)
    return false;
  }

  if (footballPlayer_obj["team"] === "" || footballPlayer_obj["team"] === null){
    let reason = "'team' cannot be null or empty"
    printCorruptedPlayer(footballPlayer_obj, reason)
    return false;
  }

  var roleClassic = footballPlayer_obj["roleClassic"]
  var roleMantra = footballPlayer_obj["roleMantra"]
  if(roleClassic === null && roleMantra === null){
    let reason = "'classicRoles' or 'roleMantra' must be defined"
    printCorruptedPlayer(footballPlayer_obj, reason)
    return false;
  }
  
  const classicRoles = ["P", "D", "C", "A"]
  if (roleClassic && !classicRoles.includes(footballPlayer_obj["roleClassic"])){
    let reason = "'classicRoles' value not allowed"
    printCorruptedPlayer(footballPlayer_obj, reason)
    return false;
  }

  const mantraRoles = ["Por", "Dd", "Ds", "Dc", "E", "M", "C", "W", "T", "A", "Pc"]
  if (roleMantra && !mantraRoles.includes(footballPlayer_obj["roleMantra"])){
    let reason = "'mantraRoles' value not allowed"
    printCorruptedPlayer(footballPlayer_obj, reason)
    return false;
  }

  if (footballPlayer_obj["actualPrice"] < 0){
    let reason = "'actualPrice' cannot be < 0"
    printCorruptedPlayer(footballPlayer_obj, reason)
    return false;
  }

  if (footballPlayer_obj["initialPrice"] < 0){
    let reason = "'initialPrice' cannot be < 0"
    printCorruptedPlayer(footballPlayer_obj, reason)
    return false;
  }

  return true; 
}

// -------------------------------------------------------------

const getPlayersFromExcelContent = (excelContent_obj, isMantra) => {
  var footballPlayerList_obj = {};

  excelContent_obj.forEach( (footballPlayer) => {

    var footballPlayerId = footballPlayer["Id"];
    var roleClassic = null;
    var roleMantra = null;

    if (isMantra) {
      roleMantra = footballPlayer["R"];
    } else {
      roleClassic = footballPlayer["R"];
    }

    // Create footballPlayer object
    var footballPlayer_obj = {
      id: footballPlayerId,
      name: footballPlayer["Nome"],
      team: footballPlayer["Squadra"],
      roleClassic: roleClassic,
      roleMantra: roleMantra,
      actualPrice: footballPlayer["Qt. A"],
      initialPrice: footballPlayer["Qt. I"],
    };

    // Check correctness of footballPlayer data
    if (containsCorrectData(footballPlayer_obj)){
      footballPlayerList_obj[footballPlayerId] = footballPlayer_obj;
    }
  });

  return footballPlayerList_obj;
};

// -------------------------------------------------------------

const savePlayerWithVersion = async (footballPlayerList_obj, version) => {
  console.log(`===== saving FootballPlayer with version: ${version}`);

  let footballPlayer = FootballPlayer({
    players: footballPlayerList_obj,
    version: version,
  });

  try {
    let data = await footballPlayer.save();
    //console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// -------------------------------------------------------------

const savePlayersJson = async (excelFilename, isMantra) => {
  
  // Excel file to Json
  var excelContent_obj = Read(excelFilename, 1);

  // Extract footballPlayer from list
  var footballPlayers_obj = getPlayersFromExcelContent(excelContent_obj, isMantra);

  // Fetch last version of FootballPlayer collection
  let footballPlayersOld_obj = null;
  try {
    // footballPlayersOld_obj = await FootballPlayer.getAll();
    footballPlayersOld_obj = await FootballPlayer.getMostUpdatedVersion();
  } catch (error) {
    console.error(error);
  }

  // There is already a version saved in the DB
  if (footballPlayersOld_obj && footballPlayersOld_obj.players) {

    var versionOld = footballPlayersOld_obj.version

    console.log(`===== FootballPlayer collection latest version from DB: ${versionOld}`)
    
    // Check if an update is needed
    var equals = _.isEqual(footballPlayersOld_obj.players,footballPlayers_obj);
    if (!equals) {
      console.log(`===== FootballPlayer collection has to be updated`);

      // TODO: remove collection FootballPlayer with old version or keep both versions so that we have a backup?
      await FootballPlayer.deleteVersion(versionOld)

      
      // save new version of collection FootballPlayer
      savePlayerWithVersion(footballPlayers_obj, ++versionOld)
    }
    else{
      console.log(`===== FootballPlayer collection is up to date`);
    }
  }

  // save players for the first time
  else {
    savePlayerWithVersion(footballPlayers_obj, 1)
  }
};

export { savePlayersJson };
