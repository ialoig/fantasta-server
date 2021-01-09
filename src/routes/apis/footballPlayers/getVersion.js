import { FootballPlayer } from "../../../database";
import { Constants, Response } from "../../../utils";

export const getVersion = async (req, res, next) => {
  let footballPlayerVersion = {};
  try {
    footballPlayerVersion = await FootballPlayer.getVersion();
  } catch (error) {
    console.error(error);
    res
      .status(400)
      .send(
        Response.reject(Constants.BAD_REQUEST, Constants.BAD_REQUEST, error)
      );
  }

  res.json(Response.resolve(Constants.OK, footballPlayerVersion));
};
