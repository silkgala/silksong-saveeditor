import React from "react"
import ReactDOM from "react-dom"
import { Encode, Decode, DownloadData } from "./functions.js"
import { MASTER_TOOL_LIST, MASTER_COLLECTABLE_LIST, MASTER_RELIC_LIST, MASTER_QUEST_LIST, MASTER_CREST_LIST, MASTER_JOURNAL_LIST } from "./masterLists.js";
import "./style.css"

const formatLabel = (key) => {
    // Add space before capital letters, then capitalize the first letter
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
};

// --- Helper Functions ---
const getOS = () => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    if (userAgent.indexOf("win") !== -1) return "windows";
    if (userAgent.indexOf("mac") !== -1) return "macos";
    if (userAgent.indexOf("linux") !== -1) return "linux";
    return "unknown";
};

const formatPlayTime = (totalSeconds) => {
    if (isNaN(totalSeconds) || totalSeconds < 0) {
        return "0 hours, 0 minutes";
    }
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return `${hours} hours, ${minutes} minutes`;
};

const CREST_SLOT_INFO = {
    "Hunter": ["White", "Yellow", "Yellow", "White", "Red", "Blue", "Blue"],
    "Reaper": ["White", "Red", "Red", "Red", "Blue", "Yellow", "White"],
    "Wanderer": ["White", "Red", "Blue", "Blue", "Yellow", "Yellow", "Yellow"],
    "Warrior": ["White", "White", "Red", "Yellow", "Yellow"],
    "Hunter_v2": ["White", "Blue", "Yellow", "White", "Red", "White", "White"],
    "Toolmaster": ["White", "Yellow", "Red", "White", "Blue", "White", "Yellow"],
    "Cursed": [],
    "Witch": ["White", "Red", "Red", "Blue", "Yellow", "White", "Yellow"],
    "Spell": ["White", "White", "Blue", "Blue", "White"],
    "Hunter_v3": ["Red", "Blue", "Yellow", "Red", "Red", "White", "White"]
};

const renderColoredLabel = (text) => {
    const parts = text.split(/(\(Red\)|\(Blue\)|\(Yellow\)|\(White\))/);
    return parts.filter(part => part).map((part, index) => {
        switch (part) {
            case '(Red)':
                return <span key={index} className="text-red">Red</span>;
            case '(Blue)':
                return <span key={index} className="text-blue">Blue</span>;
            case '(Yellow)':
                return <span key={index} className="text-yellow">Yellow</span>;
            case '(White)':
                return <span key={index}>White</span>;
            default:
                return part;
        }
    });
};

class App extends React.Component {
    constructor() {
        super()
        this.fileInputRef = React.createRef()
        this.originalSaveData = null; // Store the original unmodified save data
    }

    state = {
        saveData: null,
        fileName: "",
        dragging: false,
        error: null,
        jsonSearchTerm: "",
        jsonText: "", // Holds the text for the JSON editor
        jsonError: null,
        copiedPath: null
    }

    // --- Drag and Drop Handlers ---
    handleDragEnter = (e) => { e.preventDefault(); e.stopPropagation(); this.setState({ dragging: true }); };
    handleDragLeave = (e) => { e.preventDefault(); e.stopPropagation(); this.setState({ dragging: false }); };
    handleDragOver = (e) => { e.preventDefault(); e.stopPropagation(); };
    handleDrop = (e) => {
        e.preventDefault(); e.stopPropagation(); this.setState({ dragging: false });
        this.handleFile([...e.dataTransfer.files][0]);
    };

    // --- File Handling ---
    handleBrowseClick = () => { this.fileInputRef.current.click(); };
    handleFileSelect = (e) => { this.handleFile(e.target.files[0]); e.target.value = null; }

    handleFile = (file) => {
        if (!file || !file.name.toLowerCase().endsWith('.dat')) {
            this.setState({ error: "Invalid file type. Please upload a .dat file." });
            return;
        }

        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = () => {
            try {
                const decrypted = Decode(new Uint8Array(reader.result));
                const parsedData = JSON.parse(decrypted);
                this.originalSaveData = JSON.parse(decrypted); // Store a pristine copy

                this.setState({
                    saveData: parsedData,
                    fileName: file.name,
                    error: null,
                    jsonText: JSON.stringify(parsedData, null, 2),
                    jsonError: null
                });
            } catch (err) {
                console.error("Decryption failed:", err);
                this.setState({ error: "File decryption failed. May be corrupt or not a valid save." });
            }
        };
    }

    // This function will be called whenever the UI changes saveData
    updateJsonTextFromState = (updatedSaveData) => {
        this.setState({
            saveData: updatedSaveData,
            jsonText: JSON.stringify(updatedSaveData, null, 2),
            jsonError: null
        });
    }

    // --- Generic State Handlers ---
    handleNestedChange = (value, ...keys) => {
        const newState = JSON.parse(JSON.stringify(this.state.saveData));
        let current = newState;
        const lastKey = keys[keys.length - 1];
        for (let i = 0; i < keys.length - 1; i++) current = current[keys[i]];
        current[lastKey] = value;

        // Sync logic
        if (lastKey === 'maxHealth') {
            newState.playerData.health = value;
            newState.playerData.maxHealthBase = value;
        }
        if (lastKey === 'silkMax') {
            newState.playerData.silk = value;
        }

        this.updateJsonTextFromState(newState);
    }

    // --- Complex Array Handlers (with "Get or Create" logic) ---
    ensureItemExists = (newState, section, masterList, masterIndex, subSection = 'savedData') => {
        const pd = newState.playerData;
        const masterItem = masterList[masterIndex];

        // Ensure parent object exists
        if (!pd[section]) {
            pd[section] = { [subSection]: [] };
        }
        let savedDataArray = pd[section][subSection];

        if (!savedDataArray) {
            savedDataArray = pd[section][subSection] = [];
        }

        let item = savedDataArray.find(x => x.Name === masterItem.Name);
        if (!item) {
            const newItem = JSON.parse(JSON.stringify(masterItem));
            savedDataArray.push(newItem);
            item = savedDataArray.find(x => x.Name === masterItem.Name);
        }
        return item;
    };

    handleToolChange = (masterIndex, field, value) => {
        const newState = JSON.parse(JSON.stringify(this.state.saveData));
        const tool = this.ensureItemExists(newState, 'Tools', MASTER_TOOL_LIST, masterIndex);
        tool.Data[field] = value;
        if (field === 'IsUnlocked' && value === true) tool.Data.HasBeenSeen = true;
        this.updateJsonTextFromState(newState);
    }

    handleCollectableChange = (masterIndex, value, isEnabling) => {
        const newState = JSON.parse(JSON.stringify(this.state.saveData));
        if (isEnabling) {
            this.ensureItemExists(newState, 'Collectables', MASTER_COLLECTABLE_LIST, masterIndex);
        } else {
            const collectable = newState.playerData.Collectables.savedData.find(c => c.Name === MASTER_COLLECTABLE_LIST[masterIndex].Name);
            if (collectable) collectable.Data.Amount = value;
        }
        this.updateJsonTextFromState(newState);
    }

    handleCrestChange = (masterIndex, value) => {
        const newState = JSON.parse(JSON.stringify(this.state.saveData));
        const crest = this.ensureItemExists(newState, 'ToolEquips', MASTER_CREST_LIST, masterIndex);
        crest.Data.IsUnlocked = value;
        crest.Data.DisplayNewIndicator = false;
        this.updateJsonTextFromState(newState);
    }

    handleCrestSlotChange = (masterIndex, slotIndex, value) => {
        const newState = JSON.parse(JSON.stringify(this.state.saveData));
        const crest = this.ensureItemExists(newState, 'ToolEquips', MASTER_CREST_LIST, masterIndex);
        crest.Data.Slots[slotIndex].IsUnlocked = value;
        this.updateJsonTextFromState(newState);
    }

    handleQuestChange = (masterIndex, newStatus) => {
        const newState = JSON.parse(JSON.stringify(this.state.saveData));
        const quest = this.ensureItemExists(newState, 'QuestCompletionData', MASTER_QUEST_LIST, masterIndex);
        const questData = quest.Data;

        if (newStatus === "seen") {
            questData.HasBeenSeen = true;
            questData.IsAccepted = false;
            questData.IsCompleted = false;
        } else if (newStatus === "accepted") {
            questData.HasBeenSeen = true;
            questData.IsAccepted = true;
            questData.IsCompleted = false;
        } else if (newStatus === "completed") {
            questData.HasBeenSeen = true;
            questData.IsAccepted = true;
            questData.IsCompleted = true;
            questData.WasEverCompleted = true;
        }
        this.updateJsonTextFromState(newState);
    }

    handleQuestCountChange = (masterIndex, count) => {
        const newState = JSON.parse(JSON.stringify(this.state.saveData));
        const quest = this.ensureItemExists(newState, 'QuestCompletionData', MASTER_QUEST_LIST, masterIndex);
        quest.Data.CompletedCount = count;
        this.updateJsonTextFromState(newState);
    }

    handleRelicChange = (masterIndex, newStatus) => {
        const newState = JSON.parse(JSON.stringify(this.state.saveData));
        if (newStatus === "none") {
            const masterRelic = MASTER_RELIC_LIST[masterIndex];
            const savedDataArray = newState.playerData.Relics.savedData;
            const itemIndex = savedDataArray.findIndex(x => x.Name === masterRelic.Name);
            if (itemIndex > -1) savedDataArray.splice(itemIndex, 1);
        } else {
            const relic = this.ensureItemExists(newState, 'Relics', MASTER_RELIC_LIST, masterIndex);
            const relicData = relic.Data;
            relicData.IsCollected = false;
            relicData.IsDeposited = false;
            relicData.HasSeenInRelicBoard = false;
            if (newStatus === "collected") relicData.IsCollected = true;
            else if (newStatus === "deposited") { relicData.IsCollected = true; relicData.IsDeposited = true; }
            else if (newStatus === "seen") { relicData.IsCollected = true; relicData.IsDeposited = true; relicData.HasSeenInRelicBoard = true; }
        }
        this.updateJsonTextFromState(newState);
    }

    handleJournalEntryChange = (masterIndex, hasBeenSeen) => {
        const newState = JSON.parse(JSON.stringify(this.state.saveData));
        const entry = this.ensureItemExists(newState, 'EnemyJournalKillData', MASTER_JOURNAL_LIST, masterIndex, 'list');

        entry.Record.HasBeenSeen = hasBeenSeen;
        if (hasBeenSeen && entry.Record.Kills < 1) {
            entry.Record.Kills = 1;
        } else if (!hasBeenSeen) {
            entry.Record.Kills = 0;
        }

        this.updateJsonTextFromState(newState);
    };

    handleJournalKillsChange = (masterIndex, kills) => {
        const newState = JSON.parse(JSON.stringify(this.state.saveData));
        const entry = this.ensureItemExists(newState, 'EnemyJournalKillData', MASTER_JOURNAL_LIST, masterIndex, 'list');

        let newKills = parseInt(kills, 10);
        if (isNaN(newKills)) newKills = 1;
        if (entry.Record.HasBeenSeen && newKills < 1) {
            newKills = 1;
        }

        entry.Record.Kills = newKills;
        this.updateJsonTextFromState(newState);
    };

    // --- JSON Editor Handlers ---
    handleJsonTextChange = (e) => {
        this.setState({ jsonText: e.target.value });
    }

    handleJsonBlur = (e) => {
        try {
            const parsedData = JSON.parse(e.target.value);
            this.setState({ saveData: parsedData, jsonError: null });
        } catch (err) {
            this.setState({ jsonError: "Invalid JSON syntax. Check for missing commas, brackets, or quotes." });
        }
    }

    handleJsonSearchChange = (e) => this.setState({ jsonSearchTerm: e.target.value });

    // --- Save Handlers ---
    handleSaveEncrypted = () => {
        if (!this.state.saveData || this.state.jsonError) return;
        try {
            const jsonString = JSON.stringify(this.state.saveData);
            DownloadData(Encode(jsonString), this.state.fileName);
        } catch (err) { this.setState({ error: "Failed to save the file." }); }
    }

    handleSaveJson = () => {
        if (!this.state.saveData || this.state.jsonError) return;
        try {
            const jsonString = JSON.stringify(this.state.saveData, null, 2);
            DownloadData(jsonString, this.state.fileName.replace('.dat', '.json'));
        } catch (err) { this.setState({ error: "Failed to save the JSON file." }); }
    }

    // --- Bulk Action Handlers ---
    handleSelectAll = (section) => {
        const newState = JSON.parse(JSON.stringify(this.state.saveData));
        const pd = newState.playerData;

        switch (section) {
            case 'upgrades':
                Object.keys(pd).filter(k => k.startsWith('has') && k !== 'hasJournal' && !k.startsWith('hasPin') && !k.startsWith('hasMarker')).forEach(key => pd[key] = true);
                break;
            case 'tools':
                MASTER_TOOL_LIST.forEach((_, index) => {
                    const tool = this.ensureItemExists(newState, 'Tools', MASTER_TOOL_LIST, index);
                    tool.Data.IsUnlocked = true;
                    tool.Data.HasBeenSeen = true;
                });
                break;
            case 'crest':
                MASTER_CREST_LIST.forEach((_, index) => {
                    const crest = this.ensureItemExists(newState, 'ToolEquips', MASTER_CREST_LIST, index);
                    crest.Data.IsUnlocked = true;
                    if (crest.Data.Slots) crest.Data.Slots.forEach(slot => slot.IsUnlocked = true);
                });
                pd.UnlockedExtraBlueSlot = true;
                pd.UnlockedExtraYellowSlot = true;
                break;
            case 'maps':
                Object.keys(pd).filter(k => (k.startsWith('Has') && k.endsWith('Map')) || k.startsWith('hasPin') || k.startsWith('hasMarker')).forEach(key => pd[key] = true);
                break;
            case 'fastTravel':
                Object.keys(pd).filter(k => k.startsWith('Unlocked') || k === 'bellCentipedeAppeared').forEach(key => pd[key] = true);
                break;
            case 'savedFleas':
                Object.keys(pd).filter(k => k.startsWith('SavedFlea_')).forEach(key => pd[key] = true);
                break;
            default: break;
        }
        this.updateJsonTextFromState(newState);
    }

    handleCopyPath = (path) => {
        navigator.clipboard.writeText(path).then(() => {
            this.setState({ copiedPath: path });
            setTimeout(() => this.setState({ copiedPath: null }), 2000);
        });
    };

    // --- Helper Functions for Rendering ---
    getQuestStatus = (questData) => {
        if (!questData) return "not_encountered";
        if (questData.IsCompleted) return "completed";
        if (questData.IsAccepted) return "accepted";
        if (questData.HasBeenSeen) return "seen";
        return "not_encountered"; // Fallback
    }

    getRelicStatus = (relicData) => {
        if (!relicData) return "none";
        if (relicData.HasSeenInRelicBoard) return "seen";
        if (relicData.IsDeposited) return "deposited";
        if (relicData.IsCollected) return "collected";
        return "none";
    }

    // A helper function to render a list of event keys
    renderEventInputs = (keys) => {
        if (!this.state.saveData) return null;
        const pd = this.state.saveData.playerData;
        return keys.map(key => {
            if (pd[key] === undefined) return null; // Don't render if the key doesn't exist in the save
            const value = pd[key];
            const label = formatLabel(key);

            if (typeof value === 'boolean') {
                return (
                    <label key={key} className="form-group checkbox-group">
                        <input type="checkbox" checked={value} onChange={(e) => this.handleNestedChange(e.target.checked, 'playerData', key)} />
                        <span>{label}</span>
                    </label>
                );
            } else if (typeof value === 'number') {
                return (
                    <div key={key} className="form-group">
                        <label>{label}</label>
                        <input type="number" value={value} onChange={(e) => this.handleNestedChange(parseInt(e.target.value) || 0, 'playerData', key)} />
                    </div>
                );
            }
            return null;
        }).filter(Boolean); // Filter out nulls for keys that weren't found or aren't bool/num
    };

    render() {
        const { saveData, dragging, error, jsonSearchTerm, jsonText, jsonError, copiedPath } = this.state;
        const pd = saveData ? saveData.playerData : null;
        const currentOS = getOS();

        // Create lists of keys for easier mapping
        const upgradeKeys = pd ? Object.keys(pd).filter(k => k.startsWith('has') && k !== 'hasJournal' && !k.startsWith('hasPin') && !k.startsWith('hasMarker')) : [];
        const mapKeys = pd ? Object.keys(pd).filter(k => k.startsWith('Has') && k.endsWith('Map')) : [];
        const mapPinAndMarkerKeys = pd ? Object.keys(pd).filter(k => k.startsWith('hasPin') || k.startsWith('hasMarker')) : [];
        const fastTravelTopKeys = pd ? Object.keys(pd).filter(k => k === 'UnlockedFastTravel' || k === 'UnlockedFastTravelTeleport') : [];
        const fastTravelOtherKeys = pd ? Object.keys(pd).filter(k => (k.startsWith('Unlocked') && !fastTravelTopKeys.includes(k) && !k.includes('Slot')) || k === 'bellCentipedeAppeared') : [];
        const savedFleaKeys = pd ? Object.keys(pd).filter(k => k.startsWith('SavedFlea_')) : [];
        const fleaQuestKeys = pd ? Object.keys(pd).filter(k => k.startsWith('Caravan') || k.startsWith('FleaGames') || k.startsWith('MetTroupe') || k.startsWith('SeenFlea') || k.startsWith('grishkin')) : [];

        let jsonDisplayString = jsonText;
        if (jsonSearchTerm.trim() !== "") {
            jsonDisplayString = jsonText.split('\n').filter(line => line.toLowerCase().includes(jsonSearchTerm.toLowerCase())).join('\n');
        }

        // --- Event Keys ---
        const bossList = [
            { name: 'Moss Mother', encounteredKey: 'encounteredMossMother', defeatedKey: 'defeatedMossMother' },
            { name: 'Moss Evolver', encounteredKey: 'wokeMossEvolver', defeatedKey: 'defeatedMossEvolver' },
            { name: 'Bonetown Boss', encounteredKey: 'EncounteredBonetownBoss', defeatedKey: 'DefeatedBonetownBoss' },
            { name: 'Skull King', encounteredKey: 'skullKingAwake', defeatedKey: 'skullKingDefeated' },
            { name: 'Bell Beast', encounteredKey: 'encounteredBellBeast', defeatedKey: 'defeatedBellBeast' },
            { name: 'Ant Queen', defeatedKey: 'defeatedAntQueen' },
            { name: 'Lace (First)', encounteredKey: 'encounteredLace1', defeatedKey: 'defeatedLace1' },
            { name: 'Song Golem', encounteredKey: 'encounteredSongGolem', defeatedKey: 'defeatedSongGolem' },
            { name: 'Dock Foremen', encounteredKey: 'encounteredDockForemen', defeatedKey: 'defeatedDockForemen' },
            { name: 'Bone Flyer Giant', defeatedKey: 'defeatedBoneFlyerGiant' },
            { name: 'Ant Trapper', encounteredKey: 'encounteredAntTrapper', defeatedKey: 'defeatedAntTrapper' },
            { name: 'Vampire Gnat', encounteredKey: 'encounteredVampireGnatBoss', defeatedKey: 'defeatedVampireGnatBoss' },
            { name: 'Crow Court', encounteredKey: 'encounteredCrowCourt', defeatedKey: 'defeatedCrowCourt' },
            { name: 'Wisp Pyre Effigy', defeatedKey: 'defeatedWispPyreEffigy' },
            { name: 'Roof Crab', encounteredKey: 'roofCrabEncountered', defeatedKey: 'roofCrabDefeated' },
            { name: 'Spinner', encounteredKey: 'encounteredSpinner', defeatedKey: 'spinnerDefeated' },
            { name: 'Splinter Queen', encounteredKey: 'encounteredSplinterQueen', defeatedKey: 'defeatedSplinterQueen' },
            { name: 'Seth', encounteredKey: 'encounteredSeth', defeatedKey: 'defeatedSeth' },
            { name: 'Flower Queen', encounteredKey: 'encounteredFlowerQueen', defeatedKey: 'defeatedFlowerQueen' },
            { name: 'Roachkeeper Chef', defeatedKey: 'defeatedRoachkeeperChef' },
            { name: 'Phantom', encounteredKey: 'encounteredPhantom', defeatedKey: 'defeatedPhantom' },
            { name: 'Swamp Shaman', defeatedKey: 'DefeatedSwampShaman' },
            { name: 'Coral Drillers', encounteredKey: 'encounteredCoralDrillers', defeatedKey: 'defeatedCoralDrillers' },
            { name: 'Coral King', encounteredKey: 'encounteredCoralKing', defeatedKey: 'defeatedCoralKing' },
            { name: 'Last Judge', encounteredKey: 'encounteredLastJudge', defeatedKey: 'defeatedLastJudge' },
            { name: 'First Weaver', encounteredKey: 'encounteredFirstWeaver', defeatedKey: 'defeatedFirstWeaver' },
            { name: 'Brood Mother', defeatedKey: 'defeatedBroodMother' },
            { name: 'Trobbio', encounteredKey: 'encounteredTrobbio', defeatedKey: 'defeatedTrobbio' },
            { name: 'Tormented Trobbio', encounteredKey: 'encounteredTormentedTrobbio', defeatedKey: 'defeatedTormentedTrobbio' },
            { name: 'Cogwork Dancers', encounteredKey: 'encounteredCogworkDancers', defeatedKey: 'defeatedCogworkDancers' },
            { name: 'Lace (Tower)', encounteredKey: 'encounteredLaceTower', defeatedKey: 'defeatedLaceTower' },
            { name: 'Ward Boss', encounteredKey: 'wardBossEncountered', defeatedKey: 'wardBossDefeated' },
            { name: 'Song Chevalier', encounteredKey: 'encounteredSongChevalierBoss', defeatedKey: 'defeatedSongChevalierBoss' },
            { name: 'White Cloverstag', encounteredKey: 'encounteredWhiteCloverstag', defeatedKey: 'defeatedWhiteCloverstag' },
            { name: 'Clover Dancers', encounteredKey: 'encounteredCloverDancers', defeatedKey: 'defeatedCloverDancers' },
            { name: 'Lost Lace', encounteredKey: 'EncounteredLostLace' }
        ];

        const mainStoryEvents = pd ? ['completedTutorial', 'act2Started', 'blackThreadWorld', 'bindCutscenePlayed', 'completedAbyssAscent', 'act3_wokeUp', 'act3_enclaveWakeSceneCompleted', 'CompletedRedMemory', 'LastDiveCursedConvo', 'CollectedHeartFlower', 'CollectedHeartCoral', 'CollectedHeartHunter', 'CollectedHeartClover'] : [];
        const fixerEvents = pd ? Object.keys(pd).filter(k => k.startsWith('fixer')) : [];
        const shermaEvents = pd ? Object.keys(pd).filter(k => k.startsWith('sherma')) : [];
        const mapperEvents = pd ? Object.keys(pd).filter(k => k.startsWith('mapper') || k.startsWith('SeenMapper') || k.startsWith('MapperLeft')) : [];
        const garmondEvents = pd ? Object.keys(pd).filter(k => k.startsWith('garmond')) : [];
        const nuuAndGillyEvents = pd ? Object.keys(pd).filter(k => k.startsWith('nuu') || k.startsWith('gilly') || k.startsWith('MetHalfwayHunter')) : [];
        const bellShrineAndMemoryEvents = pd ? Object.keys(pd).filter(k => k.startsWith('bellShrine') || k.startsWith('completedMemory') || k.startsWith('chapelClosed')) : [];
        const melodyEvents = pd ? Object.keys(pd).filter(k => k.startsWith('HasMelody') || k.startsWith('UnlockedMelody') || k.startsWith('SeenMelody') || k.startsWith('HeardMelody') || k.startsWith('Conductor')) : [];
        const otherNpcEvents = pd ? [
            'metDruid', 'druidTradeIntro', 'druidMossBerriesSold', 'druidAct3Intro', 'metLearnedPilgrim', 'metLearnedPilgrimAct3', 'metDicePilgrim', 'dicePilgrimDefeated', 'dicePilgrimState', 'dicePilgrimGameExplained', 'dicePilgrimBank', 'pilgrimRestMerchant_SingConvo', 'pilgrimRestMerchant_RhinoRuckusConvo', 'pilgrimRestCrowd', 'MetCrestUpgrader', 'MetCrestUpgraderAct3', 'CrestPreUpgradeTalked', 'CrestPurposeQueued', 'CrestTalkedPurpose', 'CrestUpgraderOfferedFinal', 'HasBoundCrestUpgrader', 'churchKeeperIntro', 'churchKeeperCursedConvo', 'churchKeeperBonegraveConvo', 'ChurchKeeperLeftBasement', 'learnedPilbyName', 'pilbyFriendship', 'pilbyMeetConvo', 'pilbyCampConvo', 'pilbyMosstownConvo', 'pilbyKilled', 'pilbyLeftPilgrimsRest', 'MetForgeDaughter', 'ForgeDaughterTalkState', 'PurchasedForgeToolKit', 'BallowInSauna', 'BallowMovedToDivingBell', 'BallowGivenKey', 'ForgeDaughterWhiteFlowerDlg', 'SeenDivingBellGoneAbyss', 'MetMaskMaker', 'MetMaskMakerAct3', 'MaskMakerTalkedRelationship', 'MetArchitect', 'MetArchitectAct3', 'PurchasedArchitectKey', 'ArchitectTalkedCrest', 'LibrarianAskedForRelic', 'GivenLibrarianRelic', 'LibrarianMetAct3', 'LibrarianCollectionComplete', 'MetGourmandServant', 'GotGourmandReward', 'metCaretaker', 'CaretakerOfferedSnareQuest', 'MetSeamstress', 'SeamstressOfferedQuest', 'BlueScientistMet', 'BlueScientistQuestOffered', 'BlueAssistantBloodCount', 'BlueScientistDead', 'metGrubFarmer', 'grubFarmLevel', 'metGrubFarmerAct3', 'MetGrubFarmerMimic', 'GrubFarmerSilkGrubsSold', 'metSwampMuckmen', 'MetBelltownShopkeep', 'MetBelltownGreeter', 'MetBelltownCouriers', 'PinsmithMetBelltown', 'BelltownHermitMet', 'MetBelltownBagpipers', 'MetBelltownDoctor', 'BelltownDoctorCuredCurse', 'MetBelltownRelicDealer', 'MetFisherHomeFull', 'MetPilgrimsRestShop', 'MetAntMerchant', 'SeenAntMerchantDead', 'SprintMasterCurrentRace', 'SprintMasterExtraRaceWon', 'MetPinChallengeBug', 'PinGalleryWallet'
        ] : [];
        const locationEvents = pd ? [
            'BonePlazaOpened', 'bonegraveOpen', 'greatBoneGateOpened', 'crashingIntoGreymoor', 'crashedIntoGreymoor', 'hitCrowCourtSwitch', 'OpenedCrowSummonsDoor', 'PickedUpCrowMemento', 'sethLeftShellwood', 'openedDust05Gate', 'UnlockedDustCage', 'FixedDustBellBench', 'EnclaveStatePilgrimSmall', 'enclaveLevel', 'cityMerchantSaved', 'wardWoken', 'bankOpened', 'leftTheGrandForum', 'uncagedGiantFlea', 'tamedGiantFlea', 'completedSuperJumpSequence', 'fullyEnteredVerdania', 'ShamanRitualCursedConvo', 'FleaGamesStarted', 'FleaGamesEnded'
        ] : [];

        const savePaths = {
            windows: '%userprofile%\\appdata\\LocalLow\\Team Cherry\\Hollow Knight Silksong\\',
            windowsStore: '%LOCALAPPDATA%\\Packages\\TeamCherry.Silksong_y4jvztpgccj42\\SystemAppData\\wgs',
            macos: '~/Library/Application Support/unity.Team-Cherry.Silksong/',
            linux: '~/.config/unity3d/Team Cherry/Hollow Knight Silksong/'
        };


        return (
            <div id="wrapper">
                <h1>Silksong Save Editor</h1>
                <p className="subtitle">Visual Silksong save editor</p>
                <div className="credits">
                    <a href="https://github.com/just-addwater/silksong-saveeditor" target="_blank" rel="noopener noreferrer">Source on GitHub</a>
                    <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
                    Credit to:
                    <a href="https://github.com/bloodorca/hollow" target="_blank" rel="noopener noreferrer"> Bloodorca</a> &
                    <a href="https://github.com/KayDeeTee/Hollow-Knight-SaveManager" target="_blank" rel="noopener noreferrer"> KayDeeTee</a> & justaddwater
                </div>

                <div className="instructions">
                    <h2>How to Use</h2>
                    <ol className="important-note">
                        <li>Find your save file (e.g., <code>user1.dat</code> for save slot 1,<code>user2.dat</code> for slot 2, etc (4 total slots)) in one of the locations listed below. You can copy and paste the address below into Windows Explorer to get to that directory</li>
                        <li>Drag and drop the file onto the designated area, or use the browse button to select it.</li>
                        <li>Scroll down and edit any values you wish to change.</li>
                        <li>Click "Save & download updated save file (.dat)" and replace your old save file with the newly downloaded one or save it into a different slot.</li>
                    </ol>
                    <p className="notes">For Steam, each user’s save files will be in a sub-folder of their Steam user ID. For non-Steam builds, save files will be in a default sub-folder. </p>
                    <table className="save-locations-table"><tbody>
                        <tr className={currentOS === 'windows' ? 'highlighted' : ''}>
                            <td>Windows</td>
                            <td><code>{savePaths.windows}</code> <button className="btn-secondary btn-copy" onClick={() => this.handleCopyPath(savePaths.windows)}>{copiedPath === savePaths.windows ? 'Copied!' : 'Copy Path'}</button></td>
                        </tr>
                        <tr className={currentOS === 'windows' ? 'highlighted' : ''}>
                            <td>Microsoft Store</td>
                            <td><code>{savePaths.windowsStore}</code> <button className="btn-secondary btn-copy" onClick={() => this.handleCopyPath(savePaths.windowsStore)}>{copiedPath === savePaths.windowsStore ? 'Copied!' : 'Copy Path'}</button></td>
                        </tr>
                        <tr className={currentOS === 'macos' ? 'highlighted' : ''}>
                            <td>macOS (OS X)</td>
                            <td><code>{savePaths.macos}</code> <button className="btn-secondary btn-copy" onClick={() => this.handleCopyPath(savePaths.macos)}>{copiedPath === savePaths.macos ? 'Copied!' : 'Copy Path'}</button></td>
                        </tr>
                        <tr className={currentOS === 'linux' ? 'highlighted' : ''}>
                            <td>Linux/Steamdeck</td>
                            <td><code>{savePaths.linux}</code> <button className="btn-secondary btn-copy" onClick={() => this.handleCopyPath(savePaths.linux)}>{copiedPath === savePaths.linux ? 'Copied!' : 'Copy Path'}</button></td>
                        </tr>
                    </tbody></table>
                </div>

                <div className="warning">Always backup your save files (.dat) before editing!</div>
                <div className={`drop-zone ${dragging ? 'dragging' : ''}`} onClick={this.handleBrowseClick} onDragEnter={this.handleDragEnter} onDragLeave={this.handleDragLeave} onDragOver={this.handleDragOver} onDrop={this.handleDrop}>
                    <p>Drag and drop the userX.dat save files or</p>
                    <button className="btn-browse">Browse and select save file</button>
                    {error && <p className="error-message">{error}</p>}
                </div>

                <input id="file-input" type="file" accept=".dat" ref={this.fileInputRef} onChange={this.handleFileSelect} />
                <hr />
                <div className="save-buttons">
                    <button className="btn-secondary" onClick={this.handleSaveJson} disabled={!saveData || !!jsonError}>Save .json</button>
                    <button className="btn-primary" onClick={this.handleSaveEncrypted} disabled={!saveData || !!jsonError}>Save & download updated save file (.dat)</button>
                </div>

                {saveData && (
                    <div className="editor-container">
                        <div className="editor-section">
                            <div className="editor-section-header"><h2>Basic Stats</h2></div>
                            <div className="form-grid">
                                <div className="form-group"><label>Health</label><input type="number" value={pd.maxHealth} onChange={(e) => this.handleNestedChange(parseInt(e.target.value), 'playerData', 'maxHealth')} /><span className="note">Over 11 masks can break UI.</span></div>
                                <div className="form-group"><label>Silk</label><input type="number" value={pd.silkMax} onChange={(e) => this.handleNestedChange(parseInt(e.target.value), 'playerData', 'silkMax')} /><span className="note">Max 17.</span></div>
                                <div className="form-group"><label>Max Silk Regen</label><input type="number" value={pd.silkRegenMax} onChange={(e) => this.handleNestedChange(parseInt(e.target.value), 'playerData', 'silkRegenMax')} /></div>
                                <div className="form-group"><label>Rosaries</label><input type="number" value={pd.geo} onChange={(e) => this.handleNestedChange(parseInt(e.target.value), 'playerData', 'geo')} /></div>
                                <div className="form-group"><label>Shell Shards</label><input type="number" value={pd.ShellShards} onChange={(e) => this.handleNestedChange(parseInt(e.target.value), 'playerData', 'ShellShards')} /></div>
                                <div className="form-group"><label>Play Time</label><input type="number" value={pd.playTime} onChange={(e) => this.handleNestedChange(parseFloat(e.target.value), 'playerData', 'playTime')} /><span className="note">In seconds. ({formatPlayTime(pd.playTime)})</span></div>
                                <div className="form-group"><label>Completion %</label><input type="number" value={pd.completionPercentage} onChange={(e) => this.handleNestedChange(parseInt(e.target.value), 'playerData', 'completionPercentage')} /></div>
                                <div className="form-group"><label>Needle Upgrades</label><input type="number" value={pd.nailUpgrades} onChange={(e) => this.handleNestedChange(parseInt(e.target.value), 'playerData', 'nailUpgrades')} /><span className="note">Value from 0 to 4.</span></div>
                            </div>
                            <h3>Cheats</h3>
                            <div className="form-grid">
                                <label className="form-group checkbox-group">
                                    <input type="checkbox" checked={pd.infiniteAirJump} onChange={(e) => this.handleNestedChange(e.target.checked, 'playerData', 'infiniteAirJump')} />
                                    <span>Infinite Air Jump</span>
                                </label>
                            </div>
                        </div>

                        <div className="editor-section">
                            <div className="editor-section-header">
                                <h2>Upgrades</h2>
                                <button className="btn-secondary btn-select-all" onClick={() => this.handleSelectAll('upgrades')}>Select All</button>
                            </div>
                            <div className="form-grid">
                                <div className="form-group"><label>Heart Pieces</label><input type="number" value={pd.heartPieces} onChange={(e) => this.handleNestedChange(parseInt(e.target.value), 'playerData', 'heartPieces')} /></div>
                                <div className="form-group"><label>Silk Spool Parts</label><input type="number" value={pd.silkSpoolParts} onChange={(e) => this.handleNestedChange(parseInt(e.target.value), 'playerData', 'silkSpoolParts')} /></div>
                                {upgradeKeys.map(key => (<label key={key} className="form-group checkbox-group"><input type="checkbox" checked={pd[key]} onChange={(e) => this.handleNestedChange(e.target.checked, 'playerData', key)} /><span>{formatLabel(key)}</span></label>))}
                                <div className="form-group"><label>Attunement Level</label><input type="number" value={pd.attunementLevel} onChange={(e) => this.handleNestedChange(parseInt(e.target.value), 'playerData', 'attunementLevel')} /></div>
                                <div className="form-group">
                                    <label className="checkbox-group">
                                        <input type="checkbox" checked={pd.IsSilkSpoolBroken} onChange={(e) => this.handleNestedChange(e.target.checked, 'playerData', 'IsSilkSpoolBroken')} />
                                        <span>Silk Spool Broken</span>
                                    </label>
                                    <span className="note">Blocks silk at the start of the game.</span>
                                </div>
                            </div>
                        </div>

                        {pd.Tools && <div className="editor-section">
                            <div className="editor-section-header">
                                <h2>Tools</h2>
                                <button className="btn-secondary btn-select-all" onClick={() => this.handleSelectAll('tools')}>Select All</button>
                            </div>
                            <div className="form-grid">
                                {MASTER_TOOL_LIST.map((masterTool, masterIndex) => {
                                    const currentTool = pd.Tools.savedData.find(t => t.Name === masterTool.Name);
                                    const isEnabled = !!currentTool;
                                    const isUnlocked = isEnabled && currentTool.Data.IsUnlocked;
                                    const hasAmount = masterTool.Data.AmountLeft > 0;
                                    return (
                                        <div key={masterTool.Name} className={`tool-item-group ${!isEnabled ? 'item-group-disabled' : ''}`}>
                                            <div className="main-control">
                                                <input id={`tool-enable-${masterIndex}`} type="checkbox" checked={isUnlocked} onChange={(e) => this.handleToolChange(masterIndex, 'IsUnlocked', e.target.checked)} />
                                                <label htmlFor={`tool-enable-${masterIndex}`} style={{ opacity: isEnabled ? 1 : 0.6 }}>{masterTool.Name}</label>
                                                {hasAmount && (
                                                    <input type="number" disabled={!isEnabled} value={isEnabled ? currentTool.Data.AmountLeft : ''} onChange={(e) => this.handleToolChange(masterIndex, 'AmountLeft', parseInt(e.target.value))} />
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>}

                        {pd.ToolEquips && <div className="editor-section">
                            <div className="editor-section-header">
                                <h2>Crest</h2>
                                <button className="btn-secondary btn-select-all" onClick={() => this.handleSelectAll('crest')}>Select All</button>
                            </div>
                            <div className="crest-legend">
                                <strong>Slot Colors:</strong> &nbsp;
                                <span className="text-red">Red</span> (Weapons) &nbsp;&nbsp;
                                <span className="text-blue">Blue</span> (Defense) &nbsp;&nbsp;
                                <span className="text-yellow">Yellow</span> (Exploration) &nbsp;&nbsp;
                                <span>White</span> (Skills)
                            </div>
                            <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr', marginBottom: '20px' }}>
                                <label className="form-group checkbox-group"><input type="checkbox" checked={pd.UnlockedExtraBlueSlot} onChange={(e) => this.handleNestedChange(e.target.checked, 'playerData', 'UnlockedExtraBlueSlot')} /><span>Unlocked Extra Blue Slot</span></label>
                                <label className="form-group checkbox-group"><input type="checkbox" checked={pd.UnlockedExtraYellowSlot} onChange={(e) => this.handleNestedChange(e.target.checked, 'playerData', 'UnlockedExtraYellowSlot')} /><span>Unlocked Extra Yellow Slot</span></label>
                            </div>
                            <div className="form-grid">
                                {MASTER_CREST_LIST.map((masterCrest, masterIndex) => {
                                    const currentCrest = pd.ToolEquips.savedData.find(c => c.Name === masterCrest.Name);
                                    const isEnabled = !!currentCrest;
                                    const slotTypes = CREST_SLOT_INFO[masterCrest.Name] || [];
                                    return (
                                        <div key={masterCrest.Name} className={`crest-item-group ${!isEnabled ? 'item-group-disabled' : ''}`}>
                                            <label className="main-control">
                                                <input id={`crest-unlock-${masterIndex}`} type="checkbox" checked={isEnabled && currentCrest.Data.IsUnlocked} onChange={(e) => this.handleCrestChange(masterIndex, e.target.checked)} />
                                                <span className="crest-name" style={{ opacity: isEnabled ? 1 : 0.6 }}>{masterCrest.Name.replace(/_/g, ' ')}</span>
                                            </label>
                                            {masterCrest.Data.Slots && masterCrest.Data.Slots.length > 0 && (
                                                <div className="crest-slots">
                                                    {masterCrest.Data.Slots.map((slot, slotIndex) => (
                                                        <label key={slotIndex} className="checkbox-group">
                                                            <input
                                                                id={`crest-${masterIndex}-slot-${slotIndex}`}
                                                                type="checkbox"
                                                                disabled={!isEnabled}
                                                                checked={isEnabled && currentCrest.Data.Slots && currentCrest.Data.Slots[slotIndex] && currentCrest.Data.Slots[slotIndex].IsUnlocked}
                                                                onChange={(e) => this.handleCrestSlotChange(masterIndex, slotIndex, e.target.checked)}
                                                            />
                                                            <span style={{ opacity: isEnabled ? 1 : 0.6 }}>
                                                                {renderColoredLabel(`Slot ${slotIndex + 1} (${slotTypes[slotIndex] || 'Unknown'})`)}
                                                            </span>
                                                        </label>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>}

                        <div className="editor-section">
                            <div className="editor-section-header">
                                <h2>Maps</h2>
                                <button className="btn-secondary btn-select-all" onClick={() => this.handleSelectAll('maps')}>Select All</button>
                            </div>
                            <div className="editor-subsection-header"><h3>Obtained Maps</h3></div>
                            <div className="form-grid form-grid-columns-4">
                                {mapKeys.map(key => (<label key={key} className="form-group checkbox-group"><input type="checkbox" checked={pd[key]} onChange={(e) => this.handleNestedChange(e.target.checked, 'playerData', key)} /><span>{formatLabel(key.replace('Has', '').replace('Map', ' Map'))}</span></label>))}
                            </div>
                            <div className="editor-subsection-header"><h3>Fill out maps</h3></div>
                            <div className="form-grid">
                                <label className="form-group checkbox-group">
                                    <input type="checkbox" checked={pd.mapAllRooms} onChange={(e) => this.handleNestedChange(e.target.checked, 'playerData', 'mapAllRooms')} />
                                    <span>All Rooms Mapped</span>
                                    <span className="note" style={{ marginLeft: 'auto' }}>This fills out all maps in the game.</span>
                                </label>
                            </div>
                            <div className="editor-subsection-header"><h3>Map Pins & Markers</h3></div>
                            <div className="form-grid form-grid-columns-4">
                                {mapPinAndMarkerKeys.map(key => (<label key={key} className="form-group checkbox-group"><input type="checkbox" checked={pd[key]} onChange={(e) => this.handleNestedChange(e.target.checked, 'playerData', key)} /><span>{formatLabel(key.replace('hasPin', 'Pin: ').replace('hasMarker', 'Marker '))}</span></label>))}
                            </div>
                        </div>

                        <div className="editor-section">
                            <div className="editor-section-header">
                                <h2>Fast Travel</h2>
                                <button className="btn-secondary btn-select-all" onClick={() => this.handleSelectAll('fastTravel')}>Select All</button>
                            </div>
                            <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr', marginBottom: '20px' }}>
                                {fastTravelTopKeys.map(key => (
                                    <label key={key} className="form-group checkbox-group">
                                        <input type="checkbox" checked={pd[key]} onChange={(e) => this.handleNestedChange(e.target.checked, 'playerData', key)} />
                                        <span>{formatLabel(key)}</span>
                                    </label>
                                ))}
                            </div>
                            <hr />
                            <div className="form-grid form-grid-columns-4">
                                {fastTravelOtherKeys.map(key => (<label key={key} className="form-group checkbox-group"><input type="checkbox" checked={pd[key]} onChange={(e) => this.handleNestedChange(e.target.checked, 'playerData', key)} /><span>{formatLabel(key)}</span></label>))}
                                <div className="form-group"><label>Fast Travel NPC Location</label><input type="number" value={pd.FastTravelNPCLocation} onChange={(e) => this.handleNestedChange(parseInt(e.target.value), 'playerData', 'FastTravelNPCLocation')} /></div>
                            </div>
                        </div>

                        {pd.Collectables && <div className="editor-section">
                            <div className="editor-section-header"><h2>Collectables</h2></div>
                            <div className="form-grid">
                                {MASTER_COLLECTABLE_LIST.map((masterCollectable, masterIndex) => {
                                    const currentCollectable = pd.Collectables.savedData.find(c => c.Name === masterCollectable.Name);
                                    const isEnabled = !!currentCollectable;
                                    return (
                                        <div key={masterCollectable.Name} className={`tool-item-group ${!isEnabled ? 'item-group-disabled' : ''}`}>
                                            <div className="main-control">
                                                <input type="checkbox" checked={isEnabled} onChange={(e) => this.handleCollectableChange(masterIndex, isEnabled ? 0 : 1, e.target.checked)} />
                                                <label style={{ opacity: isEnabled ? 1 : 0.6 }}>{masterCollectable.Name.replace(/_/g, ' ')}</label>
                                                <input type="number" disabled={!isEnabled} value={isEnabled ? currentCollectable.Data.Amount : ''} onChange={(e) => this.handleCollectableChange(masterIndex, parseInt(e.target.value), false)} />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>}

                        <div className="editor-section">
                            <div className="editor-section-header"><h2>Fleas</h2></div>
                            <div className="editor-subsection-header">
                                <h3>Saved Fleas</h3>
                                <button className="btn-secondary btn-select-all" onClick={() => this.handleSelectAll('savedFleas')}>Select All</button>
                            </div>
                            <div className="form-grid form-grid-columns-4">
                                {savedFleaKeys.map(key => (<label key={key} className="form-group checkbox-group"><input type="checkbox" checked={pd[key]} onChange={(e) => this.handleNestedChange(e.target.checked, 'playerData', key)} /><span>{key.substring('SavedFlea_'.length).replace(/_/g, ' ')}</span></label>))}
                            </div>
                            <div className="editor-subsection-header"><h3>Caravan & Flea Games</h3></div>
                            <div className="form-grid">
                                {fleaQuestKeys.map(key => (
                                    typeof pd[key] === 'boolean' ?
                                        (<label key={key} className="form-group checkbox-group"><input type="checkbox" checked={pd[key]} onChange={(e) => this.handleNestedChange(e.target.checked, 'playerData', key)} /><span>{formatLabel(key)}</span></label>) :
                                        (<div key={key} className="form-group"><label>{formatLabel(key)}</label><input type="number" value={pd[key]} onChange={(e) => this.handleNestedChange(parseInt(e.target.value), 'playerData', key)} /></div>)
                                ))}
                            </div>
                        </div>

                        {pd.Relics && <div className="editor-section">
                            <div className="editor-section-header"><h2>Relics</h2></div>
                            <div className="form-grid">
                                {MASTER_RELIC_LIST.map((masterRelic, masterIndex) => {
                                    const currentRelic = pd.Relics.savedData.find(r => r.Name === masterRelic.Name);
                                    const status = this.getRelicStatus(currentRelic && currentRelic.Data);
                                    const isEnabled = !!currentRelic;
                                    return (
                                        <div key={masterRelic.Name} className={`quest-item-group ${!isEnabled ? 'item-group-disabled' : ''}`}>
                                            <div className={`quest-name ${!isEnabled ? 'label-disabled' : ''}`} style={{ opacity: isEnabled ? 1 : 0.6 }}>{masterRelic.Name.replace(/_/g, ' ')}</div>
                                            <div className="quest-controls">
                                                <div className="quest-radios">
                                                    <label><input type="radio" name={`relic-${masterIndex}`} value="none" checked={status === "none"} onChange={() => this.handleRelicChange(masterIndex, "none")} /> None</label>
                                                    <label><input type="radio" name={`relic-${masterIndex}`} value="collected" checked={status === "collected"} onChange={() => this.handleRelicChange(masterIndex, "collected")} /> Collected</label>
                                                    <label><input type="radio" name={`relic-${masterIndex}`} value="deposited" checked={status === "deposited"} onChange={() => this.handleRelicChange(masterIndex, "deposited")} /> Deposited</label>
                                                    <label><input type="radio" name={`relic-${masterIndex}`} value="seen" checked={status === "seen"} onChange={() => this.handleRelicChange(masterIndex, "seen")} /> Seen</label>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>}

                        {pd.QuestCompletionData && <div className="editor-section">
                            <div className="editor-section-header"><h2>Quests</h2></div>
                            <div className="form-grid">
                                {MASTER_QUEST_LIST.map((masterQuest, masterIndex) => {
                                    const currentQuest = pd.QuestCompletionData.savedData.find(q => q.Name === masterQuest.Name);
                                    const status = this.getQuestStatus(currentQuest && currentQuest.Data);
                                    const isEnabled = !!currentQuest;
                                    const hasCount = masterQuest.Data.CompletedCount > 0 || (currentQuest && currentQuest.Data.CompletedCount > 0);
                                    return (
                                        <div key={masterQuest.Name} className={`quest-item-group ${!isEnabled ? 'item-group-disabled' : ''}`}>
                                            <div className={`quest-name ${!isEnabled ? 'label-disabled' : ''}`} style={{ opacity: isEnabled ? 1 : 0.6 }}>{masterQuest.Name.replace(/_/g, ' ')}</div>
                                            <div className="quest-controls">
                                                <div className="quest-radios">
                                                    <label><input type="radio" name={`quest-${masterIndex}`} value="not_encountered" checked={status === "not_encountered"} onChange={() => this.handleQuestChange(masterIndex, "seen")} /> Not Encountered</label>
                                                    <label><input type="radio" name={`quest-${masterIndex}`} value="seen" checked={status === "seen"} onChange={() => this.handleQuestChange(masterIndex, "seen")} /> Seen</label>
                                                    <label><input type="radio" name={`quest-${masterIndex}`} value="accepted" checked={status === "accepted"} onChange={() => this.handleQuestChange(masterIndex, "accepted")} /> Accepted</label>
                                                    <label><input type="radio" name={`quest-${masterIndex}`} value="completed" checked={status === "completed"} onChange={() => this.handleQuestChange(masterIndex, "completed")} /> Completed</label>
                                                </div>
                                                {hasCount && (
                                                    <div className="form-group">
                                                        <input type="number" disabled={!isEnabled} value={isEnabled ? currentQuest.Data.CompletedCount : ''} onChange={(e) => this.handleQuestCountChange(masterIndex, parseInt(e.target.value))} />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>}

                        <div className="editor-section">
                            <div className="editor-section-header"><h2>Events</h2></div>

                            <div className="editor-subsection-header"><h3>Bosses</h3></div>
                            <div className="form-grid">
                                {bossList.map(boss => (
                                    <div key={boss.name} className="form-group">
                                        <label>{boss.name}</label>
                                        <div className="checkbox-group">
                                            {boss.encounteredKey && pd[boss.encounteredKey] !== undefined && (
                                                <label style={{ fontSize: '0.9em', cursor: 'pointer' }}>
                                                    <input
                                                        type="checkbox"
                                                        checked={pd[boss.encounteredKey]}
                                                        onChange={(e) => this.handleNestedChange(e.target.checked, 'playerData', boss.encounteredKey)}
                                                    />
                                                    Encountered
                                                </label>
                                            )}
                                            {boss.defeatedKey && pd[boss.defeatedKey] !== undefined && (
                                                <label style={{ fontSize: '0.9em', cursor: 'pointer' }}>
                                                    <input
                                                        type="checkbox"
                                                        checked={pd[boss.defeatedKey]}
                                                        onChange={(e) => this.handleNestedChange(e.target.checked, 'playerData', boss.defeatedKey)}
                                                    />
                                                    Defeated
                                                </label>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="editor-subsection-header"><h3>World Events</h3></div>

                            <h4>Main Progression</h4>
                            <div className="form-grid">{this.renderEventInputs(mainStoryEvents)}</div>
                            <hr />

                            <h4>Bell Shrines & Memories</h4>
                            <div className="form-grid form-grid-columns-4">{this.renderEventInputs(bellShrineAndMemoryEvents)}</div>
                            <hr />

                            <h4>Melodies</h4>
                            <div className="form-grid">{this.renderEventInputs(melodyEvents)}</div>
                            <hr />

                            <h4>Fixer Pilgrim</h4>
                            <div className="form-grid">{this.renderEventInputs(fixerEvents)}</div>
                            <hr />

                            <h4>Sherma</h4>
                            <div className="form-grid">{this.renderEventInputs(shermaEvents)}</div>
                            <hr />

                            <h4>Mapper</h4>
                            <div className="form-grid">{this.renderEventInputs(mapperEvents)}</div>
                            <hr />

                            <h4>Garmond</h4>
                            <div className="form-grid">{this.renderEventInputs(garmondEvents)}</div>
                            <hr />

                            <h4>Nuu & Gilly</h4>
                            <div className="form-grid">{this.renderEventInputs(nuuAndGillyEvents)}</div>
                            <hr />

                            <h4>Other NPCs & Quests</h4>
                            <div className="form-grid">{this.renderEventInputs(otherNpcEvents)}</div>
                            <hr />

                            <h4>Misc Location Events</h4>
                            <div className="form-grid">{this.renderEventInputs(locationEvents)}</div>
                        </div>

                        <div className="editor-section">
                            <div className="editor-section-header"><h2>Bestiary</h2></div>
                            <div className="editor-subsection-header"><h3>Journal</h3></div>
                            <div className="form-grid">
                                <label className="form-group checkbox-group">
                                    <input type="checkbox" checked={pd.hasJournal} onChange={(e) => this.handleNestedChange(e.target.checked, 'playerData', 'hasJournal')} />
                                    <span>Has Journal</span>
                                </label>
                            </div>
                            <div className="editor-subsection-header"><h3>Enemy List</h3></div>
                            <div className="form-grid">
                                {MASTER_JOURNAL_LIST.map((masterEntry, masterIndex) => {
                                    const currentEntry = pd.EnemyJournalKillData && pd.EnemyJournalKillData.list ? pd.EnemyJournalKillData.list.find(e => e.Name === masterEntry.Name) : null;
                                    const isEnabled = !!currentEntry && currentEntry.Record.HasBeenSeen;
                                    const kills = currentEntry ? currentEntry.Record.Kills : 0;
                                    return (
                                        <div key={masterEntry.Name} className={`tool-item-group ${!isEnabled ? 'item-group-disabled' : ''}`}>
                                            <div className="main-control">
                                                <input id={`journal-enable-${masterIndex}`} type="checkbox" checked={isEnabled} onChange={(e) => this.handleJournalEntryChange(masterIndex, e.target.checked)} />
                                                <label htmlFor={`journal-enable-${masterIndex}`} style={{ opacity: isEnabled ? 1 : 0.6 }}>{masterEntry.Name}</label>
                                                <input type="number" disabled={!isEnabled} value={isEnabled ? kills : ''} onChange={(e) => this.handleJournalKillsChange(masterIndex, e.target.value)} />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="editor-section">
                            <div className="editor-section-header"><h2>JSON</h2></div>
                            <div className="json-editor-controls">
                                <input
                                    type="text"
                                    className="search-input"
                                    placeholder="Search JSON..."
                                    value={jsonSearchTerm}
                                    onChange={this.handleJsonSearchChange}
                                />
                            </div>
                            {jsonError && <p className="json-error">{jsonError}</p>}
                            <p className="notes" style={{ textAlign: 'center', marginTop: '-10px', marginBottom: '10px' }}>
                                {jsonSearchTerm.trim() !== "" ? "Editing is disabled while searching. Clear search to edit." : "Click outside the text area to apply changes."}
                            </p>
                            <textarea
                                className="json-textarea"
                                style={{ opacity: jsonSearchTerm.trim() !== "" ? 0.7 : 1 }}
                                value={jsonSearchTerm.trim() !== "" ? jsonDisplayString : jsonText}
                                onChange={this.handleJsonTextChange}
                                onBlur={this.handleJsonBlur}
                                readOnly={jsonSearchTerm.trim() !== ""}
                                spellCheck="false"
                            />
                        </div>
                    </div>
                )}
            </div>
        )
    }
}

ReactDOM.render(<App />, document.querySelector("#root"));