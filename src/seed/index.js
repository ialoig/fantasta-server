import _ from 'lodash'
import { User, League, Team, Market } from "../database/models"
import { fakeUsers, fakeLeagues, fakeTeams } from "./fakeData.js"

const seed = async () => {
    try {
        const count = await User.estimatedDocumentCount({});
        console.log("[seed] user found in db: " + count)
        if (count >= 10) {
            console.log("[seed] db already seeded!")
            return
        } else {
            console.log("[seed] starting to seed db ...")
            await inserFakeUsers();
            await inserFakeLeagues();
            // await inserFakeMarket();
            await inserFakeTeams();
        }
        console.log("[seed] Done. Database seeded!")
    } catch (error) {
        console.error("Error seeding database file: " + error)
    }
}

const inserFakeUsers = async () => {
    await User.insertMany(fakeUsers);
    console.log("[seed] insert users: " + fakeUsers.length)
}

const inserFakeLeagues = async () => {
    // array of leagues created. use it to insert into league table
    let leagues = []
    // array of markets created. use it to insert into market table
    let markets = []
    for (let i = 0; i < fakeLeagues.length; i++) {

        // get a fake user from array of fake users
        let user = _.sample(fakeUsers);

        // get user obj from user table
        let userFound = await User.findOne({ email: user.email })

        // insert user found as admin of the league we want to create
        fakeLeagues[i].admin = userFound._id

        // add league to array of leagues
        leagues.push(fakeLeagues[i])

    }
    console.log("[seed] insert leagues: " + leagues.length)
    
    // inser many leagues to league table
    await League.insertMany(leagues);

    console.log("[seed] \t... done")
}


const inserFakeTeams = async () => {
    //creating teams
    let teams = []
    for (let i = 0; i < fakeTeams.length; i++) {
        let user = _.sample(fakeUsers);
        let userFound = await User.findOne({ email: user.email })
        let league = _.sample(fakeLeagues);
        let leagueFound = await League.findOne({ name: league.name })

        fakeTeams[i].user = userFound._id
        fakeTeams[i].league = leagueFound._id

        let createdTeam = await Team.create(fakeTeams[i]);
        leagueFound.teams.push(createdTeam._id);
        await leagueFound.save();

        userFound.leagues.push(leagueFound._id);
        await userFound.save();

        teams.push(fakeTeams[i])
    }
    console.log("[seed] insert teams: " + teams.length)
    console.log("[seed] \t... done")
}



const inserFakeMarket = async () => {
    // save markets created
    let markets = []
    let leagues = await League.find();
    for (let i = 0; i < leagues.length; i++) {
        let league = leagues[i]

        // create market obj for any league created and add it to array of markets
        let market = { leagueId: league._id, betHistory: [] }
        markets.push(market)
    }

    // inser many markets to market table
    console.log("[seed] insert markets (empty): " + markets.length)
    await Market.insertMany(markets)

    console.log("[seed] \t... done")
}


export { seed }
