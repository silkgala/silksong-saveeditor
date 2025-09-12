import React, { Fragment } from "react"
import ReactDOM from "react-dom"
import { Encode, Decode, DownloadData } from "./functions.js"
import "./style.css"

class App extends React.Component {
    constructor() {
        super()
        this.fileInputRef = React.createRef()
    }

    state = {
        saveData: null, // This will hold the parsed JSON object
        fileName: "",
        dragging: false,
        error: null
    }

    // --- Drag and Drop Handlers ---
    handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.setState({ dragging: true });
    };
    handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.setState({ dragging: false });
    };
    handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };
    handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.setState({ dragging: false });
        const files = [...e.dataTransfer.files];
        this.handleFile(files[0]);
    };

    // --- File Handling ---
    handleBrowseClick = () => {
        this.fileInputRef.current.click();
    };

    handleFileSelect = (e) => {
        const file = e.target.files[0];
        this.handleFile(file);
        e.target.value = null; // Reset input for re-uploading the same file
    }

    handleFile = (file) => {
        if (!file) return;

        // Validation: Check for .dat extension
        if (!file.name.toLowerCase().endsWith('.dat')) {
            this.setState({ error: "Invalid file type. Please upload a .dat file." });
            return;
        }

        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = () => {
            try {
                const result = reader.result;
                const decrypted = Decode(new Uint8Array(result));
                const parsedData = JSON.parse(decrypted);

                this.setState({
                    saveData: parsedData,
                    fileName: file.name,
                    error: null
                });
            } catch (err) {
                console.error("Decryption failed:", err);
                this.setState({ error: "File decryption failed. The file may be corrupt or not a valid Silksong save." });
            }
        };
    }

    // --- Editor Field Handlers ---
    handleNumericChange = (e, ...keys) => {
        const value = parseInt(e.target.value, 10) || 0;
        this.setState(prevState => {
            const newState = JSON.parse(JSON.stringify(prevState));
            let current = newState.saveData;
            for (let i = 0; i < keys.length - 1; i++) {
                current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = value;

            if (keys.includes('health')) {
                newState.saveData.playerData.maxHealth = value;
            }
            if (keys.includes('silk')) {
                newState.saveData.playerData.silkMax = value;
            }

            return { saveData: newState.saveData };
        });
    }

    handleCheckboxChange = (e, ...keys) => {
        const value = e.target.checked;
        this.setState(prevState => {
            const newState = JSON.parse(JSON.stringify(prevState));
            let current = newState.saveData;
            for (let i = 0; i < keys.length - 1; i++) {
                current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = value;
            return { saveData: newState.saveData };
        });
    }

    // --- Save Handlers ---
    handleSaveEncrypted = () => {
        if (!this.state.saveData) return;
        try {
            const jsonString = JSON.stringify(this.state.saveData);
            const encrypted = Encode(jsonString);
            DownloadData(encrypted, this.state.fileName);
        } catch (err) {
            console.error("Encryption/Save failed:", err);
            this.setState({ error: "Failed to save the file." });
        }
    }

    handleSaveJson = () => {
        if (!this.state.saveData) return;
        try {
            const jsonString = JSON.stringify(this.state.saveData, null, 2);
            const newFileName = this.state.fileName.replace('.dat', '.json');
            DownloadData(jsonString, newFileName);
        } catch (err) {
            console.error("JSON save failed:", err);
            this.setState({ error: "Failed to save the JSON file." });
        }
    }

    render() {
        const { saveData, dragging, error } = this.state;
        const pd = saveData ? saveData.playerData : null;

        return (
            <div id="wrapper">
                <h1>Silksong Save Editor</h1>
                <div className="credits">
                    <a href="https://github.com/just-addwater/silksong-saveeditor" target="_blank" rel="noopener noreferrer">Source on GitHub</a>
                    <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
                    Credit to:
                    <a href="https://github.com/bloodorca/hollow" target="_blank" rel="noopener noreferrer">Bloodorca</a> &
                    <a href="https://github.com/KayDeeTee/Hollow-Knight-SaveManager" target="_blank" rel="noopener noreferrer">KayDeeTee</a>
                </div>

                <div className="instructions">
                    <h2>Save File Locations</h2>
                    <table className="save-locations-table">
                        <thead>
                            <tr>
                                <th>System</th>
                                <th>Location</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td>Windows</td><td><code>%USERPROFILE%\AppData\LocalLow\Team Cherry\Silksong\</code></td></tr>
                            <tr><td>Microsoft Store</td><td><code>%LOCALAPPDATA%\Packages\TeamCherry.Silksong_y4jvztpgccj42\SystemAppData\wgs</code></td></tr>
                            <tr><td>macOS (OS X)</td><td><code>$HOME/Library/Application Support/unity.Team-Cherry.Silksong/</code></td></tr>
                            <tr><td>Linux</td><td><code>$XDG_CONFIG_HOME/unity3d/Team Cherry/Silksong/</code></td></tr>
                        </tbody>
                    </table>
                    <p className="notes">For Steam, each user’s save files will be in a sub-folder of their Steam user ID. For non-Steam builds, save files will be in a default sub-folder.</p>
                    <p className="notes"><code>user1.dat</code> for save slot 1. <code>user2.dat</code> for slot 2. 4 total save slots.</p>
                </div>

                <div className="warning">Always backup your save files (.dat) before editing!</div>

                <div
                    className={`drop-zone ${dragging ? 'dragging' : ''}`}
                    onClick={this.handleBrowseClick}
                    onDragEnter={this.handleDragEnter}
                    onDragLeave={this.handleDragLeave}
                    onDragOver={this.handleDragOver}
                    onDrop={this.handleDrop}
                >
                    <p>Drag .dat files here or</p>
                    <button className="btn-secondary">Browse Files</button>
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
                        {/* --- BASIC STATS --- */}
                        <div className="editor-section">
                            <h2>Basic Stats</h2>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label htmlFor="health">Health</label>
                                    <input id="health" type="number" value={pd.health} onChange={(e) => this.handleNumericChange(e, 'playerData', 'health')} />
                                    <span className="note">Over 11 masks can break the UI.</span>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="silk">Silk</label>
                                    <input id="silk" type="number" value={pd.silk} onChange={(e) => this.handleNumericChange(e, 'playerData', 'silk')} />
                                    <span className="note">Max 17.</span>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="rosaries">Rosaries</label>
                                    <input id="rosaries" type="number" value={pd.geo} onChange={(e) => this.handleNumericChange(e, 'playerData', 'geo')} />
                                </div>
                            </div>
                        </div>

                        {/* --- UPGRADES --- */}
                        <div className="editor-section">
                            <h2>Upgrades <span className="note">(Warning: Spoilers)</span></h2>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label htmlFor="nailUpgrades">Needle Upgrades</label>
                                    <input id="nailUpgrades" type="number" value={pd.nailUpgrades} onChange={(e) => this.handleNumericChange(e, 'playerData', 'nailUpgrades')} />
                                    <span className="note">Value from 0 to 4.</span>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="hasNeedleThrow">Has Needle Throw</label>
                                    <div className="checkbox-group">
                                        <input id="hasNeedleThrow" type="checkbox" checked={pd.hasNeedleThrow} onChange={(e) => this.handleCheckboxChange(e, 'playerData', 'hasNeedleThrow')} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* --- TOOLS --- */}
                        <div className="editor-section">
                            <h2>Tools</h2>
                            <p className="note">Tool editing features are coming soon.</p>
                        </div>

                        {/* --- FAST TRAVEL --- */}
                        <div className="editor-section">
                            <h2>Fast Travel</h2>
                            <p className="note">Fast Travel editing features are coming soon.</p>
                        </div>

                        {/* --- FLEAS --- */}
                        <div className="editor-section">
                            <h2>Fleas</h2>
                            <p className="note">Flea editing features are coming soon.</p>
                        </div>

                        {/* --- EVENTS --- */}
                        <div className="editor-section">
                            <h2>Events</h2>
                            <h3>Bosses</h3>
                            <p className="note">Boss event editing features are coming soon.</p>
                            <h3>World Events</h3>
                            <p className="note">World event editing features are coming soon.</p>
                        </div>

                        {/* --- QUESTS --- */}
                        <div className="editor-section">
                            <h2>Quests</h2>
                            <p className="note">Quest editing features are coming soon.</p>
                        </div>

                        {/* --- RELICS --- */}
                        <div className="editor-section">
                            <h2>Relics</h2>
                            <p className="note">Relic editing features are coming soon.</p>
                        </div>

                        {/* --- BESTIARY --- */}
                        <div className="editor-section">
                            <h2>Bestiary</h2>
                            <p className="note">Bestiary editing features are coming soon.</p>
                        </div>
                    </div>
                )}
            </div>
        )
    }
}

ReactDOM.render(<App />, document.querySelector("#root"));