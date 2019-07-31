import React from 'react';
import './App.css';
import GuestsListContainer from './guests-list/GuestsListContainer.js'
import TablesListContainer from "./tables-list/TablesListContainer";

function App() {
    return (
        <div className="App">
            <header className="App-header">
                Table Plan AI
            </header>
            <GuestsListContainer/>
            <TablesListContainer/>
        </div>
    );
}

export default App;
