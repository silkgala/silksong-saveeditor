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

            // Update the unlocked status
            crestData.IsUnlocked = value;

            // ** NEW LOGIC: Also set the 'new' indicator to false when this is changed **
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

    // --- Save Handlers ---
    handleSaveEncrypted = () => {
        if (!this.state.saveData) return;
        try {
            const jsonString = JSON.stringify(this.state.saveData);
            DownloadData(Encode(jsonString), this.state.fileName);
        } catch (err) { this.setState({ error: "Failed to save the file." }); }
    }

    handleSaveJson = () => {
        if (!this.state.saveData) return;
        try {
            const jsonString = JSON.stringify(this.state.saveData, null, 2);
            DownloadData(jsonString, this.state.fileName.replace('.dat', '.json'));
        } catch (err) { this.setState({ error: "Failed to save the JSON file." }); }
    }

    render() {
        const { saveData, dragging, error } = this.state;
        const pd = saveData ? saveData.playerData : null;

        // Create lists of keys for easier mapping
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

                <div className="instructions">
                    <h2>Save File Locations</h2>
                    <table className="save-locations-table">
                        <thead><tr><th>System</th><th>Location</th></tr></thead>
                        <tbody>
                            <tr><td>Windows</td><td><code>%USERPROFILE%\AppData\LocalLow\Team Cherry\Silksong\</code></td></tr>
                            <tr><td>Microsoft Store</td><td><code>%LOCALAPPDATA%\Packages\TeamCherry.Silksong_y4jvztpgccj42\SystemAppData\wgs</code></td></tr>
                            <tr><td>macOS (OS X)</td><td><code>$HOME/Library/Application Support/unity.Team-Cherry.Silksong/</code></td></tr>
                            <tr><td>Linux</td><td><code>$XDG_CONFIG_HOME/unity3d/Team Cherry/Silksong/</code></td></tr>
                        </tbody>
                    </table>
                    <p className="notes"><code>user1.dat</code> for save slot 1, etc. (4 total slots).</p>
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
                    <button className="btn-secondary" onClick={this.handleSaveJson} disabled={!saveData}>Save .json</button>
                    <button className="btn-primary" onClick={this.handleSaveEncrypted} disabled={!saveData}>Save Encrypted .dat</button>
                </div>

                {saveData && (
                    <div className="editor-container">
                        <div className="editor-section">
                            <h2>Basic Stats</h2>
                            <div className="form-grid">
                                <div className="form-group"><label>Health</label><input type="number" value={pd.health} onChange={(e) => this.handleNestedChange(parseInt(e.target.value), 'playerData', 'health')} /><span className="note">Over 11 masks can break UI.</span></div>
                                <div className="form-group"><label>Silk</label><input type="number" value={pd.silk} onChange={(e) => this.handleNestedChange(parseInt(e.target.value), 'playerData', 'silk')} /><span className="note">Max 17.</span></div>
                                <div className="form-group"><label>Rosaries</label><input type="number" value={pd.geo} onChange={(e) => this.handleNestedChange(parseInt(e.target.value), 'playerData', 'geo')} /></div>
                                <div className="form-group"><label>Silk Regen Max</label><input type="number" value={pd.silkRegenMax} onChange={(e) => this.handleNestedChange(parseInt(e.target.value), 'playerData', 'silkRegenMax')} /></div>
                                <div className="form-group"><label>Needle Upgrades</label><input type="number" value={pd.nailUpgrades} onChange={(e) => this.handleNestedChange(parseInt(e.target.value), 'playerData', 'nailUpgrades')} /><span className="note">Value from 0 to 4.</span></div>
                            </div>
                        </div>

                        <div className="editor-section">
                            <h2>Upgrades</h2>
                            <div className="form-grid">
                                {upgradeKeys.map(key => (<div key={key} className="form-group"><label>{formatLabel(key)}</label><div className="checkbox-group"><input type="checkbox" checked={pd[key]} onChange={(e) => this.handleNestedChange(e.target.checked, 'playerData', key)} /></div></div>))}
                                <div className="form-group"><label>Attunement Level</label><input type="number" value={pd.attunementLevel} onChange={(e) => this.handleNestedChange(parseInt(e.target.value), 'playerData', 'attunementLevel')} /></div>
                            </div>
                        </div>

                        <div className="editor-section">
                            <h2>Tools</h2>
                            <div className="form-grid">
                                {pd.Tools.savedData.map((tool, index) => (
                                    <div key={tool.Name} className="tool-item-group">
                                        <label htmlFor={`tool-unlock-${index}`}>{tool.Name}</label>
                                        <input id={`tool-unlock-${index}`} type="checkbox" checked={tool.Data.IsUnlocked} onChange={(e) => this.handleToolChange(index, 'IsUnlocked', e.target.checked)} />
                                        {this.originalSaveData.playerData.Tools.savedData[index].Data.AmountLeft > 0 && (
                                            <input type="number" value={tool.Data.AmountLeft} onChange={(e) => this.handleToolChange(index, 'AmountLeft', parseInt(e.target.value))} />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="editor-section">
                            <h2>Crest</h2>
                            <div className="form-grid">
                                {pd.ToolEquips.savedData.map((crest, crestIndex) => (
                                    <div key={crest.Name} className="crest-item-group">
                                        <div className="checkbox-group">
                                            <input id={`crest-unlock-${crestIndex}`} type="checkbox" checked={crest.Data.IsUnlocked} onChange={(e) => this.handleCrestChange(crestIndex, e.target.checked)} />
                                            <label htmlFor={`crest-unlock-${crestIndex}`}>{crest.Name}</label>
                                        </div>
                                        {crest.Data.Slots && crest.Data.Slots.length > 0 && (
                                            <div className="crest-slots">
                                                {crest.Data.Slots.map((slot, slotIndex) => (
                                                    <div key={slotIndex} className="checkbox-group">
                                                        <input id={`crest-${crestIndex}-slot-${slotIndex}`} type="checkbox" checked={slot.IsUnlocked} onChange={(e) => this.handleCrestSlotChange(crestIndex, slotIndex, e.target.checked)} />
                                                        <label htmlFor={`crest-${crestIndex}-slot-${slotIndex}`}>Slot {slotIndex + 1}</label>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="editor-section">
                            <h2>Maps</h2>
                            <h3>Obtained Maps</h3>
                            <div className="form-grid">
                                {mapKeys.map(key => (<div key={key} className="form-group"><label>{formatLabel(key.replace('Has', '').replace('Map', ' Map'))}</label><div className="checkbox-group"><input type="checkbox" checked={pd[key]} onChange={(e) => this.handleNestedChange(e.target.checked, 'playerData', key)} /></div></div>))}
                            </div>
                            <h3>Map Pins</h3>
                            <div className="form-grid">
                                {mapPinKeys.map(key => (<div key={key} className="form-group"><label>{formatLabel(key.replace('hasPin', 'Pin: '))}</label><div className="checkbox-group"><input type="checkbox" checked={pd[key]} onChange={(e) => this.handleNestedChange(e.target.checked, 'playerData', key)} /></div></div>))}
                            </div>
                        </div>

                        <div className="editor-section">
                            <h2>Fast Travel</h2>
                            <div className="form-grid">
                                {fastTravelKeys.map(key => (<div key={key} className="form-group"><label>{formatLabel(key)}</label><div className="checkbox-group"><input type="checkbox" checked={pd[key]} onChange={(e) => this.handleNestedChange(e.target.checked, 'playerData', key)} /></div></div>))}
                                <div className="form-group"><label>Fast Travel NPC Location</label><input type="number" value={pd.FastTravelNPCLocation} onChange={(e) => this.handleNestedChange(parseInt(e.target.value), 'playerData', 'FastTravelNPCLocation')} /></div>
                            </div>
                        </div>

                        <div className="editor-section">
                            <h2>Fleas</h2>
                            <h3>Saved Fleas</h3>
                            <div className="form-grid">
                                {savedFleaKeys.map(key => (<div key={key} className="form-group"><label>{key.substring('SavedFlea_'.length)}</label><div className="checkbox-group"><input type="checkbox" checked={pd[key]} onChange={(e) => this.handleNestedChange(e.target.checked, 'playerData', key)} /></div></div>))}
                            </div>
                            <h3>Caravan & Flea Games</h3>
                            <div className="form-grid">
                                {fleaQuestKeys.map(key => (
                                    typeof pd[key] === 'boolean' ?
                                        (<div key={key} className="form-group"><label>{formatLabel(key)}</label><div className="checkbox-group"><input type="checkbox" checked={pd[key]} onChange={(e) => this.handleNestedChange(e.target.checked, 'playerData', key)} /></div></div>) :
                                        (<div key={key} className="form-group"><label>{formatLabel(key)}</label><input type="number" value={pd[key]} onChange={(e) => this.handleNestedChange(parseInt(e.target.value), 'playerData', key)} /></div>)
                                ))}
                            </div>
                        </div>

                        <div className="editor-section"><h2>Relics</h2><p className="note">Relic editing features are coming soon.</p></div>
                        <div className="editor-section"><h2>Quests</h2><p className="note">Quest editing features are coming soon.</p></div>
                        <div className="editor-section"><h2>Events</h2><h3>Bosses</h3><p className="note">Boss event editing features are coming soon.</p><h3>World Events</h3><p className="note">World event editing features are coming soon.</p></div>
                        <div className="editor-section"><h2>Bestiary</h2><p className="note">Bestiary editing features are coming soon.</p></div>
                    </div>
                )}
            </div>
        )
    }
}

ReactDOM.render(<App />, document.querySelector("#root"));