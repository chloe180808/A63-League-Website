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

const knockoutFixtures = [
    { homeTeam: "AOC", awayTeam: "Dancers FC", homeGoals: 3, awayGoals: 1 },
    { homeTeam: "MAAB", awayTeam: "P Waggons FC", homeGoals: null, awayGoals: null }
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

    values.forEach((value, index) => {
        const td = document.createElement('td');
        td.textContent = value;

        // Apply styling classes to specific columns
        if (index === 1) {
            td.classList.add('team-name');
        }

        if (index === 8) {
            td.classList.add('points');
        }

        row.appendChild(td);
    });

        tableBody.appendChild(row);
    });
}

function checkUnplayed(fixture) {
    return fixture.homeGoals == null || fixture.awayGoals == null;
}


function renderKnockoutFixtures(fixtures) {
    const container = document.querySelector('#knockout-fixtures');

    container.innerHTML = '';

    fixtures.forEach(fixture => {

        // Main knockout card
        const knockout = document.createElement('div');
        knockout.classList.add('knockout');

        // Container for both teams
        const match = document.createElement('div');
        match.classList.add('match');

        // Home team
        const homeTeam = document.createElement('div');
        homeTeam.classList.add('match-team');

        const homeScore = document.createElement('span');
        homeScore.classList.add('match-score');
        homeScore.textContent = fixture.homeGoals ?? '-';

        const homeName = document.createElement('span');
        homeName.textContent = fixture.homeTeam;

        homeTeam.appendChild(homeScore);
        homeTeam.appendChild(homeName);

        // Away team
        const awayTeam = document.createElement('div');
        awayTeam.classList.add('match-team');

        const awayScore = document.createElement('span');
        awayScore.classList.add('match-score');
        awayScore.textContent = fixture.awayGoals ?? '-';

        const awayName = document.createElement('span');
        awayName.textContent = fixture.awayTeam;

        awayTeam.appendChild(awayScore);
        awayTeam.appendChild(awayName);

        // Add both teams to the match
        match.appendChild(homeTeam);
        match.appendChild(awayTeam);

        // Match result/status
        const result = document.createElement('div');
        result.classList.add('result');

        if (checkUnplayed(fixture)) {
            result.textContent = 'Not played';
        } else if (fixture.homeGoals > fixture.awayGoals) {
            result.textContent = `${fixture.homeTeam} win`;
        } else if (fixture.awayGoals > fixture.homeGoals) {
            result.textContent = `${fixture.awayTeam} win`;
        } else {
            result.textContent = 'Draw';
        }

        // Assemble the card
        knockout.appendChild(match);
        knockout.appendChild(result);

        // Add card to the page
        container.appendChild(knockout);
    });
}


const leagueTable = generateLeagueTable(teams, fixtures);

renderLeagueTable(leagueTable);
renderKnockoutFixtures(knockoutFixtures);