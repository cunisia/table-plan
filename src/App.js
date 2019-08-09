import React from 'react';
import './App.css';
import GuestsListContainer from './guests-list/GuestsListContainer.js';
import TablesListContainer from './tables-list/TablesListContainer';
import ConstraintListContainer from './constraints-list/ConstraintsListContainer';

function App() {
    return (
        <div className="App">
            <header className="App-header">
                Table Plan AI
            </header>
            <GuestsListContainer/>
            <TablesListContainer/>
            <ConstraintListContainer/>
        </div>
    );
}

export default App;
