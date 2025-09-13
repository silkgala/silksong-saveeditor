import React from "react"
import ReactDOM from "react-dom"
import { Encode, Decode, DownloadData } from "./functions.js"
import { MASTER_TOOL_LIST, MASTER_COLLECTABLE_LIST, MASTER_RELIC_LIST, MASTER_QUEST_LIST, MASTER_CREST_LIST } from "./masterLists.js";
import "./style.css"

const formatLabel = (key) => {
    // Add space before capital letters, then capitalize the first letter
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
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
        jsonError: null,
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

                this.setState({ saveData: parsedData, fileName: file.name, error: null });
            } catch (err) {
                console.error("Decryption failed:", err);
                this.setState({ error: "File decryption failed. May be corrupt or not a valid save." });
            }
        };
    }

    // --- Generic State Handlers ---
    handleNestedChange = (value, ...keys) => {
        this.setState(prevState => {
            const newState = JSON.parse(JSON.stringify(prevState.saveData));
            let current = newState;
            const lastKey = keys[keys.length - 1];
            for (let i = 0; i < keys.length - 1; i++) current = current[keys[i]];
            current[lastKey] = value;

            // Sync logic
            if (lastKey === 'health') {
                newState.playerData.maxHealth = value;
                newState.playerData.maxHealthBase = value;
            }
            if (lastKey === 'silk') {
                newState.playerData.silkMax = value;
            }

            return { saveData: newState };
        });
    }

    // --- Complex Array Handlers (with "Get or Create" logic) ---

    // Generic function to ensure an item exists in a savedData array
    ensureItemExists = (newState, section, masterList, masterIndex) => {
        const pd = newState.playerData;
        const masterItem = masterList[masterIndex];
        const savedDataArray = pd[section].savedData;

        let item = savedDataArray.find(x => x.Name === masterItem.Name);
        if (!item) {
            const newItem = JSON.parse(JSON.stringify(masterItem));
            savedDataArray.push(newItem);
            item = savedDataArray.find(x => x.Name === masterItem.Name);
        }
        return item;
    };

    handleToolChange = (masterIndex, field, value) => {
        this.setState(prevState => {
            const newState = JSON.parse(JSON.stringify(prevState.saveData));
            const tool = this.ensureItemExists(newState, 'Tools', MASTER_TOOL_LIST, masterIndex);

            tool.Data[field] = value;
            if (field === 'IsUnlocked' && value === true) tool.Data.HasBeenSeen = true;

            return { saveData: newState };
        });
    }

    // Handles enabling/disabling a collectable or changing its value
    handleCollectableChange = (masterIndex, value, isEnabling) => {
        this.setState(prevState => {
            const newState = JSON.parse(JSON.stringify(prevState.saveData));
            if (isEnabling) {
                this.ensureItemExists(newState, 'Collectables', MASTER_COLLECTABLE_LIST, masterIndex);
            } else {
                const collectable = newState.playerData.Collectables.savedData.find(c => c.Name === MASTER_COLLECTABLE_LIST[masterIndex].Name);
                if (collectable) collectable.Data.Amount = value;
            }
            return { saveData: newState };
        });
    }

    handleCrestChange = (masterIndex, value) => {
        this.setState(prevState => {
            const newState = JSON.parse(JSON.stringify(prevState.saveData));
            const crest = this.ensureItemExists(newState, 'ToolEquips', MASTER_CREST_LIST, masterIndex);
            crest.Data.IsUnlocked = value;
            crest.Data.DisplayNewIndicator = false;
            return { saveData: newState };
        });
    }

    handleCrestSlotChange = (masterIndex, slotIndex, value) => {
        this.setState(prevState => {
            const newState = JSON.parse(JSON.stringify(prevState.saveData));
            const crest = this.ensureItemExists(newState, 'ToolEquips', MASTER_CREST_LIST, masterIndex);
            crest.Data.Slots[slotIndex].IsUnlocked = value;
            return { saveData: newState };
        });
    }

    handleQuestChange = (masterIndex, newStatus) => {
        this.setState(prevState => {
            const newState = JSON.parse(JSON.stringify(prevState.saveData));
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
            return { saveData: newState };
        });
    }

    handleQuestCountChange = (masterIndex, count) => {
        this.setState(prevState => {
            const newState = JSON.parse(JSON.stringify(prevState.saveData));
            const quest = this.ensureItemExists(newState, 'QuestCompletionData', MASTER_QUEST_LIST, masterIndex);
            quest.Data.CompletedCount = count;
            return { saveData: newState };
        });
    }

    handleRelicChange = (masterIndex, newStatus) => {
        this.setState(prevState => {
            const newState = JSON.parse(JSON.stringify(prevState.saveData));
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
            return { saveData: newState };
        });
    }

    // --- JSON Editor Handlers ---
    handleJsonTextChange = (e) => {
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
        this.setState(prevState => {
            const newState = JSON.parse(JSON.stringify(prevState.saveData));
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
            return { saveData: newState };
        });
    }

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

    render() {
        const { saveData, dragging, error, jsonSearchTerm, jsonError } = this.state;
        const pd = saveData ? saveData.playerData : null;

        // Create lists of keys for easier mapping
        const upgradeKeys = pd ? Object.keys(pd).filter(k => k.startsWith('has') && k !== 'hasJournal' && !k.startsWith('hasPin') && !k.startsWith('hasMarker')) : [];
        const mapKeys = pd ? Object.keys(pd).filter(k => k.startsWith('Has') && k.endsWith('Map')) : [];
        const mapPinAndMarkerKeys = pd ? Object.keys(pd).filter(k => k.startsWith('hasPin') || k.startsWith('hasMarker')) : [];
        const fastTravelKeys = pd ? Object.keys(pd).filter(k => k.startsWith('Unlocked') || k === 'bellCentipedeAppeared') : [];
        const savedFleaKeys = pd ? Object.keys(pd).filter(k => k.startsWith('SavedFlea_')) : [];
        const fleaQuestKeys = pd ? Object.keys(pd).filter(k => k.startsWith('Caravan') || k.startsWith('FleaGames') || k.startsWith('MetTroupe') || k.startsWith('SeenFlea') || k.startsWith('grishkin')) : [];

        let jsonDisplayString = "";
        if (saveData) {
            const fullJsonString = JSON.stringify(saveData, null, 2);
            if (jsonSearchTerm.trim() === "") {
                jsonDisplayString = fullJsonString;
            } else {
                jsonDisplayString = fullJsonString.split('\n').filter(line => line.toLowerCase().includes(jsonSearchTerm.toLowerCase())).join('\n');
            }
        }


        return (
            <div id="wrapper">
                <h1>Silksong Save Editor</h1>
                <div className="credits">
                    <a href="https://github.com/just-addwater/silksong-saveeditor" target="_blank" rel="noopener noreferrer">Source on GitHub</a>
                    <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
                    Credit to:
                    <a href="https://github.com/bloodorca/hollow" target="_blank" rel="noopener noreferrer"> Bloodorca</a> &
                    <a href="https://github.com/KayDeeTee/Hollow-Knight-SaveManager" target="_blank" rel="noopener noreferrer"> KayDeeTee</a>
                </div>

                <div className="instructions">
                    <h2>Save File Locations</h2>
                    <table className="save-locations-table"><tbody>
                        <tr><td>Windows</td><td><code>%USERPROFILE%\AppData\LocalLow\Team Cherry\Silksong\</code></td></tr>
                        <tr><td>Microsoft Store</td><td><code>%LOCALAPPDATA%\Packages\TeamCherry.Silksong_y4jvztpgccj42\SystemAppData\wgs</code></td></tr>
                        <tr><td>macOS (OS X)</td><td><code>$HOME/Library/Application Support/unity.Team-Cherry.Silksong/</code></td></tr>
                        <tr><td>Linux</td><td><code>$XDG_CONFIG_HOME/unity3d/Team Cherry/Silksong/</code></td></tr>
                    </tbody></table>
                    <p className="notes"><strong><code>user1.dat</code> for save slot 1, etc. (4 total slots).</strong></p>
                    <p className="notes">For Steam, each user’s save files will be in a sub-folder of their Steam user ID. For non-Steam builds, save files will be in a default sub-folder.</p>
                </div>

                <div className="warning">Always backup your save files (.dat) before editing!</div>
                <div className={`drop-zone ${dragging ? 'dragging' : ''}`} onClick={this.handleBrowseClick} onDragEnter={this.handleDragEnter} onDragLeave={this.handleDragLeave} onDragOver={this.handleDragOver} onDrop={this.handleDrop}>
                    <p>Drag .dat files here or</p>
                    <button className="btn-browse">Browse Files</button>
                    {error && <p className="error-message">{error}</p>}
                </div>

                <input id="file-input" type="file" accept=".dat" ref={this.fileInputRef} onChange={this.handleFileSelect} />
                <hr />
                <div className="save-buttons">
                    <button className="btn-secondary" onClick={this.handleSaveJson} disabled={!saveData || !!jsonError}>Save .json</button>
                    <button className="btn-primary" onClick={this.handleSaveEncrypted} disabled={!saveData || !!jsonError}>Save Encrypted .dat</button>
                </div>

                {saveData && (
                    <div className="editor-container">
                        <div className="editor-section">
                            <div className="editor-section-header"><h2>Basic Stats</h2></div>
                            <div className="form-grid">
                                <div className="form-group"><label>Health</label><input type="number" value={pd.health} onChange={(e) => this.handleNestedChange(parseInt(e.target.value), 'playerData', 'health')} /><span className="note">Over 11 masks can break UI.</span></div>
                                <div className="form-group"><label>Silk</label><input type="number" value={pd.silk} onChange={(e) => this.handleNestedChange(parseInt(e.target.value), 'playerData', 'silk')} /><span className="note">Max 17.</span></div>
                                <div className="form-group"><label>Rosaries</label><input type="number" value={pd.geo} onChange={(e) => this.handleNestedChange(parseInt(e.target.value), 'playerData', 'geo')} /></div>
                                <div className="form-group"><label>Shell Shards</label><input type="number" value={pd.ShellShards} onChange={(e) => this.handleNestedChange(parseInt(e.target.value), 'playerData', 'ShellShards')} /></div>
                                <div className="form-group"><label>Completion %</label><input type="number" value={pd.completionPercentage} onChange={(e) => this.handleNestedChange(parseInt(e.target.value), 'playerData', 'completionPercentage')} /></div>
                                <div className="form-group"><label>Needle Upgrades</label><input type="number" value={pd.nailUpgrades} onChange={(e) => this.handleNestedChange(parseInt(e.target.value), 'playerData', 'nailUpgrades')} /><span className="note">Value from 0 to 4.</span></div>
                                <div className="form-group"><label>Silk Regen Max</label><input type="number" value={pd.silkRegenMax} onChange={(e) => this.handleNestedChange(parseInt(e.target.value), 'playerData', 'silkRegenMax')} /></div>
                                <div className="form-group"><label>Silk Spool Broken</label><div className="checkbox-group"><input type="checkbox" checked={pd.IsSilkSpoolBroken} onChange={(e) => this.handleNestedChange(e.target.checked, 'playerData', 'IsSilkSpoolBroken')} /></div></div>
                            </div>
                        </div>

                        <div className="editor-section">
                            <div className="editor-section-header">
                                <h2>Upgrades</h2>
                                <button className="btn-secondary btn-select-all" onClick={() => this.handleSelectAll('upgrades')}>Select All</button>
                            </div>
                            <div className="form-grid">
                                {upgradeKeys.map(key => (<div key={key} className="form-group"><label>{formatLabel(key)}</label><div className="checkbox-group"><input type="checkbox" checked={pd[key]} onChange={(e) => this.handleNestedChange(e.target.checked, 'playerData', key)} /></div></div>))}
                                <div className="form-group"><label>Attunement Level</label><input type="number" value={pd.attunementLevel} onChange={(e) => this.handleNestedChange(parseInt(e.target.value), 'playerData', 'attunementLevel')} /></div>
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
                                            <input id={`tool-enable-${masterIndex}`} type="checkbox" checked={isUnlocked} onChange={(e) => this.handleToolChange(masterIndex, 'IsUnlocked', e.target.checked)} />
                                            <label htmlFor={`tool-enable-${masterIndex}`} style={{ opacity: isEnabled ? 1 : 0.6 }}>{masterTool.Name}</label>
                                            {hasAmount && (
                                                <input type="number" disabled={!isEnabled} value={isEnabled ? currentTool.Data.AmountLeft : ''} onChange={(e) => this.handleToolChange(masterIndex, 'AmountLeft', parseInt(e.target.value))} />
                                            )}
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
                            <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr', marginBottom: '20px' }}>
                                <div className="form-group"><label>Unlocked Extra Blue Slot</label><div className="checkbox-group"><input type="checkbox" checked={pd.UnlockedExtraBlueSlot} onChange={(e) => this.handleNestedChange(e.target.checked, 'playerData', 'UnlockedExtraBlueSlot')} /></div></div>
                                <div className="form-group"><label>Unlocked Extra Yellow Slot</label><div className="checkbox-group"><input type="checkbox" checked={pd.UnlockedExtraYellowSlot} onChange={(e) => this.handleNestedChange(e.target.checked, 'playerData', 'UnlockedExtraYellowSlot')} /></div></div>
                            </div>
                            <div className="form-grid">
                                {MASTER_CREST_LIST.map((masterCrest, masterIndex) => {
                                    const currentCrest = pd.ToolEquips.savedData.find(c => c.Name === masterCrest.Name);
                                    const isEnabled = !!currentCrest;
                                    return (
                                        <div key={masterCrest.Name} className={`crest-item-group ${!isEnabled ? 'item-group-disabled' : ''}`}>
                                            <div className="checkbox-group">
                                                <input id={`crest-unlock-${masterIndex}`} type="checkbox" checked={isEnabled && currentCrest.Data.IsUnlocked} onChange={(e) => this.handleCrestChange(masterIndex, e.target.checked)} />
                                                <label htmlFor={`crest-unlock-${masterIndex}`} style={{ opacity: isEnabled ? 1 : 0.6 }}>{masterCrest.Name.replace(/_/g, ' ')}</label>
                                            </div>
                                            {masterCrest.Data.Slots && masterCrest.Data.Slots.length > 0 && (
                                                <div className="crest-slots">
                                                    {masterCrest.Data.Slots.map((slot, slotIndex) => (
                                                        <div key={slotIndex} className="checkbox-group">
                                                            <input
                                                                id={`crest-${masterIndex}-slot-${slotIndex}`}
                                                                type="checkbox"
                                                                disabled={!isEnabled}
                                                                checked={isEnabled && currentCrest.Data.Slots && currentCrest.Data.Slots[slotIndex] && currentCrest.Data.Slots[slotIndex].IsUnlocked}
                                                                onChange={(e) => this.handleCrestSlotChange(masterIndex, slotIndex, e.target.checked)}
                                                            />
                                                            <label htmlFor={`crest-${masterIndex}-slot-${slotIndex}`} style={{ opacity: isEnabled ? 1 : 0.6 }}>Slot {slotIndex + 1}</label>
                                                        </div>
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
                            <div className="form-grid">
                                {mapKeys.map(key => (<div key={key} className="form-group"><label>{formatLabel(key.replace('Has', '').replace('Map', ' Map'))}</label><div className="checkbox-group"><input type="checkbox" checked={pd[key]} onChange={(e) => this.handleNestedChange(e.target.checked, 'playerData', key)} /></div></div>))}
                            </div>
                            <div className="editor-subsection-header"><h3>Map Pins & Markers</h3></div>
                            <div className="form-grid">
                                {mapPinAndMarkerKeys.map(key => (<div key={key} className="form-group"><label>{formatLabel(key.replace('hasPin', 'Pin: ').replace('hasMarker', 'Marker '))}</label><div className="checkbox-group"><input type="checkbox" checked={pd[key]} onChange={(e) => this.handleNestedChange(e.target.checked, 'playerData', key)} /></div></div>))}
                            </div>
                        </div>

                        <div className="editor-section">
                            <div className="editor-section-header">
                                <h2>Fast Travel</h2>
                                <button className="btn-secondary btn-select-all" onClick={() => this.handleSelectAll('fastTravel')}>Select All</button>
                            </div>
                            <div className="form-grid">
                                {fastTravelKeys.map(key => (<div key={key} className="form-group"><label>{formatLabel(key)}</label><div className="checkbox-group"><input type="checkbox" checked={pd[key]} onChange={(e) => this.handleNestedChange(e.target.checked, 'playerData', key)} /></div></div>))}
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
                                            <input type="checkbox" checked={isEnabled} onChange={(e) => this.handleCollectableChange(masterIndex, isEnabled ? 0 : 1, e.target.checked)} />
                                            <label style={{ opacity: isEnabled ? 1 : 0.6 }}>{masterCollectable.Name.replace(/_/g, ' ')}</label>
                                            <input type="number" disabled={!isEnabled} value={isEnabled ? currentCollectable.Data.Amount : ''} onChange={(e) => this.handleCollectableChange(masterIndex, parseInt(e.target.value), false)} />
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
                            <div className="form-grid">
                                {savedFleaKeys.map(key => (<div key={key} className="form-group"><label>{key.substring('SavedFlea_'.length).replace(/_/g, ' ')}</label><div className="checkbox-group"><input type="checkbox" checked={pd[key]} onChange={(e) => this.handleNestedChange(e.target.checked, 'playerData', key)} /></div></div>))}
                            </div>
                            <div className="editor-subsection-header"><h3>Caravan & Flea Games</h3></div>
                            <div className="form-grid">
                                {fleaQuestKeys.map(key => (
                                    typeof pd[key] === 'boolean' ?
                                        (<div key={key} className="form-group"><label>{formatLabel(key)}</label><div className="checkbox-group"><input type="checkbox" checked={pd[key]} onChange={(e) => this.handleNestedChange(e.target.checked, 'playerData', key)} /></div></div>) :
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
                                                    <label><input type="radio" name={`quest-${masterIndex}`} value="seen" disabled={!isEnabled} checked={status === "seen"} onChange={() => this.handleQuestChange(masterIndex, "seen")} /> Seen</label>
                                                    <label><input type="radio" name={`quest-${masterIndex}`} value="accepted" disabled={!isEnabled} checked={status === "accepted"} onChange={() => this.handleQuestChange(masterIndex, "accepted")} /> Accepted</label>
                                                    <label><input type="radio" name={`quest-${masterIndex}`} value="completed" disabled={!isEnabled} checked={status === "completed"} onChange={() => this.handleQuestChange(masterIndex, "completed")} /> Completed</label>
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

                        <div className="editor-section"><h2>Events</h2><h3>Bosses</h3><p className="note">Boss event editing features are coming soon.</p><h3>World Events</h3><p className="note">World event editing features are coming soon.</p></div>
                        <div className="editor-section"><h2>Bestiary</h2><p className="note">Bestiary editing features are coming soon.</p></div>

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
                            <textarea
                                className="json-textarea"
                                value={jsonDisplayString}
                                onChange={this.handleJsonTextChange}
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