const teams = ["AOC", "10 Pence Gang", "Dancers FC", "MAAB", "FSF FC", "Hangover 96", "Unreal Madrid FC", "P Waggons FC", "Spikeyless FC"]

const fixtures = [
    { homeTeam: "MAAB", awayTeam: "AOC", homeGoals: 3, awayGoals: 1 },
    { homeTeam: "Dancers FC", awayTeam: "MAAB", homeGoals: 2, awayGoals: 2 },
    { homeTeam: "MAAB", awayTeam: "FSF FC", homeGoals: 0, awayGoals: 1 },
    { homeTeam: "Spikeyless FC", awayTeam: "MAAB", homeGoals: 1, awayGoals: 4 },
    { homeTeam: "AOC", awayTeam: "FSF FC", homeGoals: 2, awayGoals: 0 },
    { homeTeam: "AOC", awayTeam: "Dancers FC", homeGoals: null, awayGoals: null },
    { homeTeam: "FSF FC", awayTeam: "Hangover 96", homeGoals: null, awayGoals: null }
];

function getRecord(team, fixtures) {
    let played = 0;
    let wins = 0;
    let draws = 0;
    let losses = 0;
    let goalsFor = 0;
    let goalsAgainst = 0;
    let goalDifference = 0;
    let points = 0;

    if (teams.includes(team)) {

    for (let i=0; i < fixtures.length; i ++) {
        if (fixtures[i].homeTeam != team && fixtures[i].awayTeam != team) {
            continue;
        } else if (fixtures[i].homeGoals == null || fixtures[i].awayGoals == null) {
            continue;
        }
        let myGoals;
        let opponentGoals;
        if (fixtures[i].homeTeam == team) {
            myGoals = fixtures[i].homeGoals;
            opponentGoals = fixtures[i].awayGoals;
        } else {
            myGoals = fixtures[i].awayGoals;
            opponentGoals = fixtures[i].homeGoals;
        }

        if (myGoals > opponentGoals) {
            wins ++;
        } else if (myGoals == opponentGoals) {
            draws ++;
        } else {
            losses ++;
        }
        goalsFor += myGoals;
        goalsAgainst += opponentGoals;
    }
    played = wins + draws + losses
    points = (wins*3 + draws)
    goalDifference = goalsFor - goalsAgainst;

    return {team,played,wins,draws,losses,goalsFor,goalsAgainst,goalDifference,points};
    } else {
        return team + " not in league."
    }
}

function sortTeams(a,b) {
    if (b.points - a.points != 0) {
        return b.points - a.points;
    }
    if (b.goalDifference - a.goalDifference != 0) {
        return b.goalDifference - a.goalDifference;
    }
    return b.goalsFor - a.goalsFor;
}

function generateLeagueTable(teams, fixtures) {
    let table = [];
    for (let i=0;i<teams.length;i++) {
        table.push(getRecord(teams[i], fixtures));
    }
    table.sort(sortTeams);
    for (let i=0;i<table.length;i++) {
        let row = table[i];
        row.position = i + 1;
    }
    return table;
}

function renderLeagueTable(table) {
    const tableBody = document.querySelector('#league-table-body');

    tableBody.innerHTML = '';

    table.forEach(item => {
        const row = document.createElement('tr');
        
        const values = [
            item.position,
            item.team,
            item.played,
            item.wins,
            item.draws,
            item.losses,
            `${item.goalsFor}-${item.goalsAgainst}`,
            item.goalDifference > 0 ? `+${item.goalDifference}` : item.goalDifference,
            item.points
        ]

        values.forEach(value => {
            const td = document.createElement('td');
            td.textContent = value;
            row.appendChild(td);
        });

        tableBody.appendChild(row);
    });
}

function checkUnplayed(fixture) {
    return fixture.homeGoals == null || fixture.awayGoals == null;
}

const leagueTable = generateLeagueTable(teams, fixtures);

renderLeagueTable(leagueTable);