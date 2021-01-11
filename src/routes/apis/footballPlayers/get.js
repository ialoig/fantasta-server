import { FootballPlayer } from "../../../database";
import { Constants, Response } from "../../../utils";

/**
 * handle API "fantasta/footballPlayers?version=0"
 * use query param "version" to check the freshness of the footballPlayer list on the mobile
 */
export const get = async (req, res, next) => {
  let footballPlayers = {};
  try {
    footballPlayers = await FootballPlayer.get();
  } catch (error) {
    console.error(error);
    res
      .status(400)
      .send(
        Response.reject(Constants.BAD_REQUEST, Constants.BAD_REQUEST, error)
      );
  }

  let response_obj = {};

  if (footballPlayers) {

    let mobileVersion = parseInt(req.query.version) || 0;

    // if(footballPlayers.version < mobileVersion){
    //     console.error("mobile version of footballPlayers > then current version")
    //     res.json(Response.resolve(Constants.INT_SERV_ERR, response_obj));
    // }
    
    response_obj = {
    version: footballPlayers.version,
    footballPlayers: footballPlayers.version === mobileVersion? {}: footballPlayers.footballPlayers,
    updated: mobileVersion === footballPlayers.version,
    };

    res.json(Response.resolve(Constants.OK, response_obj));
  }
};
