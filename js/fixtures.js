const totalGameweeks = 8;
let currentGameweek = 1;

// Gameweek 9 represents unscheduled matches.
const unscheduledPage = 9;

let allFixtures = [];

function getFixturesByGameweek(fixtures, gameweek) {

    if (gameweek === unscheduledPage) {
        return fixtures.filter(fixture =>
            fixture.gameweek == null
        );
    }

    return fixtures.filter(fixture =>
        Number(fixture.gameweek) === gameweek &&
        fixture.gameweek != null
    );
}

function getFixturesByTeam(fixtures, team) {
    if (team === "all-teams") {
        return fixtures;
    }

    return fixtures.filter(fixture =>
        fixture.homeTeam === team ||
        fixture.awayTeam === team
    );
}

function populateFilter(selectId, options) {
    const container = document.querySelector(selectId);

    options.forEach(option => {
        const element = document.createElement("option");

        element.value = option;
        element.textContent = option;

        container.appendChild(element);
    });
}

function renderFixtures(fixtures) {

    const container = document.querySelector(
        "#fixtures-container"
    );

    container.innerHTML = "";

    if (fixtures.length === 0) {
        const message = document.createElement("p");
        message.classList.add("fixtures-empty");
        message.textContent = "No fixtures assigned yet.";

        container.appendChild(message);
        return;
    }

    fixtures.forEach(fixture => {

        // Main fixture card
        const card = document.createElement("article");
        card.classList.add("fixture-card");

        // Fixture details
        const details = document.createElement("div");
        details.classList.add("fixture-details");

        const gameweek = document.createElement("span");
        gameweek.classList.add("fixture-gameweek");

        gameweek.textContent = fixture.gameweek == null
            ? "Gameweek TBC"
            : `Gameweek ${fixture.gameweek}`;

        const date = document.createElement("span");
        date.classList.add("fixture-date");

        date.textContent = fixture.matchDate || "Date TBC";

        details.appendChild(gameweek);
        details.appendChild(date);

        // Match layout
        const match = document.createElement("div");
        match.classList.add("fixture-match");

        // Home team
        const homeTeam = createFixtureTeam(
            fixture.homeTeam,
            "home"
        );

        // Score
        const score = document.createElement("span");
        score.classList.add("fixture-score");

        if (
            fixture.homeGoals == null ||
            fixture.awayGoals == null
        ) {
            score.textContent = "VS";
        } else {
            score.textContent =
                `${fixture.homeGoals} - ${fixture.awayGoals}`;
        }

        // Away team
        const awayTeam = createFixtureTeam(
            fixture.awayTeam,
            "away"
        );

        match.appendChild(homeTeam);
        match.appendChild(score);
        match.appendChild(awayTeam);

        card.appendChild(details);
        card.appendChild(match);

        container.appendChild(card);
    });
}

function createFixtureTeam(teamName, side) {

    const team = document.createElement("div");
    team.classList.add("fixture-team", `fixture-${side}`);

    // Logo placeholder
    const logo = document.createElement("div");
    logo.classList.add("fixture-logo");

    // Generate initials
    const initials = teamName
        .split(" ")
        .map(word => word[0])
        .join("")
        .slice(0, 3)
        .toUpperCase();

    logo.textContent = initials;

    // Team name
    const name = document.createElement("span");
    name.classList.add("fixture-team-name");
    name.textContent = teamName;

    team.appendChild(logo);
    team.appendChild(name);

    return team;
}

function updateGameweek() {

    const title = document.querySelector("#gameweek-title");

    const previousButton = document.querySelector(
        "#previous-gameweek"
    );

    const nextButton = document.querySelector(
        "#next-gameweek"
    );

    // Update heading
    if (currentGameweek === unscheduledPage) {
        title.textContent = "Unscheduled";
    } else {
        title.textContent = `Gameweek ${currentGameweek}`;
    }

    // Filter by gameweek
    const selectedFixtures = getFixturesByGameweek(
        allFixtures,
        currentGameweek
    );

    // Get the currently selected team
    const selectedTeam = document.querySelector("#team-filter").value;

    // Filter by team
    const filteredFixtures = getFixturesByTeam(
        selectedFixtures,
        selectedTeam
    );

    // Display the filtered fixtures
    renderFixtures(filteredFixtures);
    }

function setupGameweekNavigation() {
    const previousButton = document.querySelector("#previous-gameweek");
    const nextButton = document.querySelector("#next-gameweek");

    previousButton.addEventListener("click", () => {
        if (currentGameweek === 1) {
            currentGameweek = unscheduledPage;
        } else {
            currentGameweek--;
        }

        updateGameweek();
    });

    nextButton.addEventListener("click", () => {
        if (currentGameweek === unscheduledPage) {
            currentGameweek = 1;
        } else {
            currentGameweek++;
        }

        updateGameweek();
    });
}

function getCurrentGameweek(fixtures) {
    const scheduledFixtures = fixtures.filter(fixture =>
        fixture.gameweek != null
    );

    // If no matches have assigned gameweeks,
    // open the Unscheduled page.
    if (scheduledFixtures.length === 0) {
        return unscheduledPage;
    }

    // Temporary fallback until we have reliable match dates.
    return 1;
}

async function initialiseFixturesPage() {

    try {
        const { teams, fixtures } = await loadLeagueData();

        populateFilter("#team-filter", teams);

        const teamFilter = document.querySelector("#team-filter");

        teamFilter.addEventListener("change", () => {
            updateGameweek();
        });

        // Store every fixture
        allFixtures = fixtures;
        currentGameweek = getCurrentGameweek(allFixtures);

        // Set up navigation buttons
        setupGameweekNavigation();

        // Display the first gameweek
        updateGameweek();

    } catch (error) {
        console.error("Could not load fixtures:", error);

        document.querySelector(
            "#fixtures-container"
        ).textContent = "Unable to load fixtures.";
    }
}

initialiseFixturesPage();