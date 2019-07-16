import React from 'react';
import './App.css';
import GuestsList from './guests-list/GuestsList.js'
import TablesList from "./tables-list/TablesList";

function App() {
    return (
        <div className="App">
            <header className="App-header">
                Table Plan AI
            </header>
            <GuestsList/>
            <TablesList/>
        </div>
    );
}

export default App;
