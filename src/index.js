import React from "react"
import ReactDOM from "react-dom"
import { Encode, Decode, DownloadData } from "./functions.js"
import "./style.css"

const formatLabel = (key) => {
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
};

class App extends React.Component {
    constructor() {
        super()
        this.fileInputRef = React.createRef()
        this.originalSaveData = null;
    }

    state = {
        saveData: null,
        fileName: "",
        dragging: false,
        error: null
    }

    handleDragEnter = (e) => { e.preventDefault(); e.stopPropagation(); this.setState({ dragging: true }); };
    handleDragLeave = (e) => { e.preventDefault(); e.stopPropagation(); this.setState({ dragging: false }); };
    handleDragOver = (e) => { e.preventDefault(); e.stopPropagation(); };
    handleDrop = (e) => {
        e.preventDefault(); e.stopPropagation(); this.setState({ dragging: false });
        this.handleFile([...e.dataTransfer.files][0]);
    };

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
                this.originalSaveData = JSON.parse(decrypted);
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
            for (let i = 0; i < keys.length - 1; i++) current = current[keys[i]];
            current[keys[keys.length - 1]] = value;
            if (keys.includes('health')) newState.playerData.maxHealth = value;
            if (keys.includes('silk')) newState.playerData.silkMax = value;
            return { saveData: newState };
        });
    }

    // --- Complex Array Handlers ---
    handleToolChange = (index, field, value) => {
        this.setState(prevState => {
            const newState = JSON.parse(JSON.stringify(prevState.saveData));
            const tool = newState.playerData.Tools.savedData[index];
            tool.Data[field] = value;
            if (field === 'IsUnlocked' && value === true) tool.Data.HasBeenSeen = true;
            return { saveData: newState };
        });
    }

    handleCrestChange = (crestIndex, value) => {
        this.setState(prevState => {
            const newState = JSON.parse(JSON.stringify(prevState.saveData));
            const crestData = newState.playerData.ToolEquips.savedData[crestIndex].Data;
            crestData.IsUnlocked = value;
            crestData.DisplayNewIndicator = false;
            return { saveData: newState };
        });
    }

    handleCrestSlotChange = (crestIndex, slotIndex, value) => {
        this.setState(prevState => {
            const newState = JSON.parse(JSON.stringify(prevState.saveData));
            newState.playerData.ToolEquips.savedData[crestIndex].Data.Slots[slotIndex].IsUnlocked = value;
            return { saveData: newState };
        });
    }

    handleQuestChange = (questIndex, newStatus) => {
        this.setState(prevState => {
            const newState = JSON.parse(JSON.stringify(prevState.saveData));
            const questData = newState.playerData.QuestCompletionData.savedData[questIndex].Data;

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

    handleQuestCountChange = (questIndex, count) => {
        this.setState(prevState => {
            const newState = JSON.parse(JSON.stringify(prevState.saveData));
            newState.playerData.QuestCompletionData.savedData[questIndex].Data.CompletedCount = count;
            return { saveData: newState };
        });
    }

    // --- Save Handlers ---
    handleSaveEncrypted = () => { /* ... (same as before) ... */ }
    handleSaveJson = () => { /* ... (same as before) ... */ }

    // Helper to determine the current status of a quest for radio buttons
    getQuestStatus = (questData) => {
        if (questData.IsCompleted) return "completed";
        if (questData.IsAccepted) return "accepted";
        if (questData.HasBeenSeen) return "seen";
        return "none";
    }

    render() {
        const { saveData, dragging, error } = this.state;
        const pd = saveData ? saveData.playerData : null;

        const upgradeKeys = pd ? Object.keys(pd).filter(k => k.startsWith('has') && !['hasJournal', 'hasNeedleThrow'].includes(k)) : [];
        const mapKeys = pd ? Object.keys(pd).filter(k => k.startsWith('Has') && k.endsWith('Map')) : [];
        const mapPinKeys = pd ? Object.keys(pd).filter(k => k.startsWith('hasPin')) : [];
        const fastTravelKeys = pd ? Object.keys(pd).filter(k => k.startsWith('Unlocked') || k === 'bellCentipedeAppeared') : [];
        const savedFleaKeys = pd ? Object.keys(pd).filter(k => k.startsWith('SavedFlea_')) : [];
        const fleaQuestKeys = pd ? Object.keys(pd).filter(k => k.startsWith('Caravan') || k.startsWith('FleaGames') || k.startsWith('MetTroupe') || k.startsWith('SeenFlea') || k.startsWith('grishkin')) : [];

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

                <div className="instructions">{/* ... (same as before) ... */}</div>
                <div className="warning">Always backup your save files (.dat) before editing!</div>
                <div className={`drop-zone ${dragging ? 'dragging' : ''}`} onClick={this.handleBrowseClick} onDragEnter={this.handleDragEnter} onDragLeave={this.handleDragLeave} onDragOver={this.handleDragOver} onDrop={this.handleDrop}>
                    <p>Drag .dat files here or</p>
                    <button className="btn-browse">Browse Files</button>
                    {error && <p className="error-message">{error}</p>}
                </div>

                <input id="file-input" type="file" accept=".dat" ref={this.fileInputRef} onChange={this.handleFileSelect} />
                <hr />
                <div className="save-buttons">
                    <button className="btn-secondary" onClick={this.handleSaveJson} disabled={!saveData}>Save .json</button>
                    <button className="btn-primary" onClick={this.handleSaveEncrypted} disabled={!saveData}>Save Encrypted .dat</button>
                </div>

                {saveData && (
                    <div className="editor-container">
                        <div className="editor-section">{/* ... Basic Stats ... */}</div>
                        <div className="editor-section">{/* ... Upgrades ... */}</div>
                        <div className="editor-section">{/* ... Tools ... */}</div>
                        <div className="editor-section">{/* ... Crest ... */}</div>
                        <div className="editor-section">{/* ... Maps ... */}</div>

                        <div className="editor-section">
                            <h2>Fast Travel</h2>
                            <div className="form-grid">
                                {fastTravelKeys.map(key => (<div key={key} className="form-group"><label>{formatLabel(key)}</label><div className="checkbox-group"><input type="checkbox" checked={pd[key]} onChange={(e) => this.handleNestedChange(e.target.checked, 'playerData', key)} /></div></div>))}
                                <div className="form-group"><label>Fast Travel NPC Location</label><input type="number" value={pd.FastTravelNPCLocation} onChange={(e) => this.handleNestedChange(parseInt(e.target.value), 'playerData', 'FastTravelNPCLocation')} /></div>
                            </div>
                        </div>

                        <div className="editor-section">{/* ... Fleas ... */}</div>
                        <div className="editor-section">{/* ... Relics ... */}</div>

                        <div className="editor-section">
                            <h2>Quests</h2>
                            <div className="form-grid">
                                {pd.QuestCompletionData.savedData.map((quest, index) => (
                                    <div key={quest.Name} className="quest-item-group">
                                        <div className="quest-name">{quest.Name}</div>
                                        <div className="quest-controls">
                                            <div className="quest-radios">
                                                <label><input type="radio" name={`quest-${index}`} value="seen" checked={this.getQuestStatus(quest.Data) === "seen"} onChange={() => this.handleQuestChange(index, "seen")} /> Seen</label>
                                                <label><input type="radio" name={`quest-${index}`} value="accepted" checked={this.getQuestStatus(quest.Data) === "accepted"} onChange={() => this.handleQuestChange(index, "accepted")} /> Accepted</label>
                                                <label><input type="radio" name={`quest-${index}`} value="completed" checked={this.getQuestStatus(quest.Data) === "completed"} onChange={() => this.handleQuestChange(index, "completed")} /> Completed</label>
                                            </div>
                                            {this.originalSaveData.playerData.QuestCompletionData.savedData[index].Data.CompletedCount > 0 && (
                                                <div className="form-group">
                                                    <input type="number" value={quest.Data.CompletedCount} onChange={(e) => this.handleQuestCountChange(index, parseInt(e.target.value))} />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="editor-section">{/* ... Events ... */}</div>
                        <div className="editor-section">{/* ... Bestiary ... */}</div>
                    </div>
                )}
            </div>
        )
    }
}

// NOTE: To save space, the unchanged render blocks like "Basic Stats" are shown as comments.
// In your actual file, you'll replace the full file content.
ReactDOM.render(<App />, document.querySelector("#root"));