const knockoutFixtures = [
    { homeTeam: "AOC", awayTeam: "Dancers FC", homeGoals: 3, awayGoals: 1 },
    { homeTeam: "MAAB", awayTeam: "P Waggons FC", homeGoals: null, awayGoals: null }
];

async function loadLeagueData() {
    const teamsResponse = await fetch("/api/teams");
    const matchesResponse = await fetch("/api/matches");

    if (!teamsResponse.ok || !matchesResponse.ok) {
        throw new Error("Failed to load league data");
    }

    const teamsData = await teamsResponse.json();
    const fixtures = await matchesResponse.json();

    const teams = teamsData.map(team => team.TeamName);

    console.log("Teams:", teams);
    console.log("Fixtures:", fixtures);

    return { teams, fixtures };
}