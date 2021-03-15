import _ from 'lodash'
import { User, League, Team } from "../database/models"
import { fakeUsers, fakeLeagues, fakeTeams } from "./fakeData.js"

const seed = async () => {
    try {
        const count = await User.estimatedDocumentCount({});
        console.log("[seed] user found in db=" +count)
        if (count >= 10) {
            console.log("[seed] db already seeded!")
            return
        } else {
            await inserFakeUsers();        
            await inserFakeLeagues();            
            await inserFakeTeams();
        }
        console.log("[seed] Done. Database seeded!")
    } catch (error) {
        console.error("Error seeding database file: " + error)
    }   
}

const inserFakeUsers = async () => {
    console.log("[seed] insert users=" +fakeUsers.length)
    await User.insertMany(fakeUsers);
}

const inserFakeLeagues = async () => {
    //creating leagues
    let leagues = []
    for (let i=0; i<fakeLeagues.length; i++) {
        let user = _.sample(fakeUsers);
        let userFound = await User.findOne({email: user.email})
        fakeLeagues[i].admin = userFound._id
        
        leagues.push(fakeLeagues[i])
    }
    console.log("[seed] insert leagues=" +leagues.length)
    let createdLeagues = await League.insertMany(leagues);
    console.log("[seed] \t... done")
}


const inserFakeTeams = async () => {
    //creating teams
    let teams = []
    for (let i=0; i<fakeTeams.length; i++) {
        let user = _.sample(fakeUsers);
        let userFound = await User.findOne({email: user.email})
        let league = _.sample(fakeLeagues);
        let leagueFound = await League.findOne({name: league.name})
        
        fakeTeams[i].user = userFound._id
        fakeTeams[i].league = leagueFound._id
        
        let createdTeam = await Team.create(fakeTeams[i]);
        leagueFound.teams.push(createdTeam._id);
        await leagueFound.save();

        userFound.leagues.push(leagueFound._id);
        await userFound.save();

        teams.push(fakeTeams[i])
    }    
    console.log("[seed] insert teams=" +teams.length)
    console.log("[seed] \t... done")
}

export { seed }
