
const _ = require("lodash");
const { User, League, Team } = require("../models");

import { fakeUsers, fakeLeagues, fakeTeams } from "./fakeData"

const seed = async () => {
    try {
        const count = await User.estimatedDocumentCount({});
        console.log("[seed] - user found in db=" +count)
        if (count >= 10) {
            console.log("[seed] - db already seeded ! Return.")
            return
        } else {

            await inserFakeUsers();
        
            await inserFakeLeagues();
            
            await inserFakeTeams();
        }


        console.log("[seed] - Done. Database seeded!")
    } catch (error) {
        console.error("Error seeding database file: " + error)
    }   
}

const inserFakeUsers = async () => {
    console.log("[seed] - insert users=" +fakeUsers.length)
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
    console.log("[seed] - insert leagues=" +leagues.length)
    let createdLeagues = await League.insertMany(leagues);

    console.log("[seed] - updating users with leagues")
    let allUsers = await User.find()
    for (let i in allUsers) {
        let randomLeagues = _.sampleSize(createdLeagues, Math.random() * createdLeagues.length)
        allUsers[i].leagues = randomLeagues.map( league => {
            return league._id
        })
        await allUsers[i].save();
    }
    console.log("[seed] - \t... done")

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
        
        teams.push(fakeTeams[i])
    }
    
    console.log("[seed] - insert teams=" +teams.length)
    let createdTeams = await Team.insertMany(teams);

    console.log("[seed] - updating leagues with team")
    let allLeagues = await League.find()
    for (let i in allLeagues) {
        let randomTeams = _.sampleSize(createdTeams, Math.random() * createdTeams.length)
        allLeagues[i].teams = randomTeams.map( team => {
            return team._id
        })
        await allLeagues[i].save();
    }
    console.log("[seed] - \t... done")
}

export { seed }