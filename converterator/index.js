/* 
 * Script for converting markdown description files in the repository into proper 
 * pages with emulation. Outputs into /docs/games; overwriting everything there.
 * The automation should delete the existing files, then run this to replace them.
 * That way, we'll delete any files that go away.
*/

const frontMatter = require('front-matter'),
    path = require('path'),
    fs = require('fs'),
    assert = require('assert')
    // FIXME: Default false
    isVerbose = process.env.VERBOSE || true;

const supportedEmulators = fs.readdirSync(path.join(__dirname, '..', 'emulators'));
let emulatorData = {};

function logVerbose() {
    if (isVerbose) { console.info.apply(this, arguments); }
}

function logInfo() {
    console.info.apply(this, arguments);
}

function logError() {
    console.error.apply(this, arguments);
}

// Make sure the game output directory is present
if (!fs.existsSync(path.join(__dirname, '..', 'docs', 'games'))) {
    logVerbose('Creating output games directory...');
    fs.mkdirSync(path.join(__dirname, '..', 'docs', 'games'));
}

// And includes for the emulators
if (!fs.existsSync(path.join(__dirname, '..', 'docs', '_includes'))) {
    fs.mkdirSync(path.join(__dirname, '..', 'docs', '_includes'));
}

// Build up supported emulators
supportedEmulators.forEach(function(emulator) {

    let data = fs.readFileSync(path.join(__dirname, '..', 'emulators', emulator, 'index.md')).toString(),
        parsed = frontMatter(data);

    emulatorData[emulator.replace('.md', '')] = parsed.attributes;
    
    fs.writeFileSync(path.join(__dirname, '..', 'docs', '_includes', emulator + '.md'), parsed.body);
    logVerbose(`Wrote emulator "${emulator}" to "_includes/${emulator}.md`);
});


fs.readdir(path.join(__dirname, '..', 'games'), function(err, gamesList) {
    if (err) {
        logError('Failed reading games list. Dying!', err);
        process.exit(1);
    }
    
    gamesList.forEach(function(game) {
        const gamePath = path.join(__dirname, '..', 'games', game),
        // Using sync methods to make code simpler and more readable. We don't care that much about performance here.
            gameData = fs.readFileSync(gamePath).toString();


        let gameDetails = frontMatter(gameData);
        gameDetails.filename = gamePath;
        gameDetails.resultFilePath = path.join(__dirname, '..', 'docs', 'games', game.replace('.md', ''));

        // Normally I'd probably put this in the normalize function, but this needs to happen prior to validation.
        // Other stuff in validation needs to happen prior to normalizing... so, meh, we'll do this.
        if (!gameDetails.attributes.emulator || gameDetails.attributes.emulator === 'default') {
            gameDetails.attributes.emulator = gameDetails.attributes.console;
        }    

        validateGameDetails(gameDetails);
        gameDetails = normalizeGameDetails(gameDetails);

        gameDetails.emulatorDetails = emulatorData[gameDetails.attributes.emulator];

        gameDetails.emulatorAboutHtml = buildEmulatorHtml(gameDetails);


        logVerbose(`Putting "${gameDetails.attributes.title}" from ${gameDetails.filename} to ${gameDetails.resultFilePath}.`);

        if (!fs.existsSync(gameDetails.resultFilePath)) {
            fs.mkdirSync(gameDetails.resultFilePath);
        }

        let fullMdContents = `---
title: "${gameDetails.attributes.title}"
permalink: games/${game.replace('.md', '')}
---

# ${gameDetails.attributes.title}

<iframe src="/retro-host/games/${game.replace('.md', '')}/embed" width="${gameDetails.emulatorDetails.width}" height="${gameDetails.emulatorDetails.height}"></iframe>

${gameDetails.body}

`;

    let embedMdContents = `---
title: "${gameDetails.attributes.title}"
permalink: games/${game.replace('.md', '')}/embed
layout: none
---

{% include ${gameDetails.attributes.emulator}.md rom="${gameDetails.attributes.rom}" %}

${gameDetails.emulatorAboutHtml}
`;



        fs.writeFileSync(path.join(gameDetails.resultFilePath, 'index.md'), fullMdContents);
        fs.writeFileSync(path.join(gameDetails.resultFilePath, 'embed.html'), embedMdContents);

    });
});

// Do a bunch of normalization on the game's attributes to avoid silly mistakes. (Changing case, merging fields, etc)
function normalizeGameDetails(gameDetails) {
    gameDetails.attributes.emulator = gameDetails.attributes.emulator.toLowerCase();
    gameDetails.attributes.console = gameDetails.attributes.console.toLowerCase();

    return gameDetails;
}


// Make sure the current game's details are valid; if not, exit the process.
// The goal here is to tell the user what's wrong, since this is very likely to the thing a user sees when a PR fails to go through.
function validateGameDetails(gameDetails) {
    assert.ok(typeof gameDetails.attributes.console !== 'undefined', 'Console type not specified in markdown front matter.');
    assert.ok(typeof gameDetails.attributes.title !== 'undefined', 'Game title not specified in markdown front matter.');
    assert.ok(typeof gameDetails.attributes.rom !== 'undefined', 'No rom url present in markdown front matter.');
    assert.ok(supportedEmulators.indexOf(gameDetails.attributes.emulator.toLowerCase()) !== -1, `Unsupported emulator ${gameDetails.attributes.emulator} found. Supported options are: ${supportedEmulators.toString()}`)
}

// Returns a fancy string of html representing the details for a game. Should be the emulator name, license and author.
function buildEmulatorHtml(gameDetails) {
    return `
    <div style="position: absolute; right: 10px; top: 10px;">
    <div style="padding: 10px; background-color: gray; display: none; cursor: pointer; text-align: center;" id="gameQuestion">?</div>
    <div style="padding: 10px; padding-top: 0; background-color: gray; display: none;" id="gameDescription">
    <p><h4><a href="${gameDetails.emulatorDetails.url}">${gameDetails.emulatorDetails.name}</a></h4></p>
    <p><strong>Author: <a href="${gameDetails.emulatorDetails.author_url}">${gameDetails.emulatorDetails.author}</a></p>
    <p><strong>License: <a href="${gameDetails.emulatorDetails.license_url}">${gameDetails.emulatorDetails.license}</a></p>
    </div>
    <script type="text/javascript">
        function showIt() {
            $('#gameQuestion').show();
        }
        function hideIt() {
            $('#gameQuestion').hide();
        }
        var questionTimeout = null;
        $(document).ready(function() {
            $('body').mousemove(function() {
                showIt();
                if (questionTimeout !== null) {
                    clearTimeout(questionTimeout);
                }
                questionTimeout = setTimeout(hideIt, 5000);
            });

            $('#gameQuestion').click(function() {
                $('#gameDescription').toggle();
            });
        });
    </script>
    `
}