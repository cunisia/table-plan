import React, {Fragment} from 'react';
import GuestUtils from '../guests-list/GuestUtils';

const Plan = (props) => {
    return (
        <section id="plan">
            <h1>Table Plan</h1>
            {props.planWrapper.error ? (<div>{props.planWrapper.error}</div>) : (<TablePlan {...props}/>)}
            <button
                id="plan__generate"
                type="button"
                onClick={_ => props.generatePlan()}>
                Generate Plan
            </button>
        </section>
    );
};

const TablePlan = (props) => {
    const {guestsList, tablesList} = props;
    const guestsMap = guestsList.reduce((map, guest) => {
        map[guest.id] = guest
        return map;
    }, {});
    const {plan: seats} = props.planWrapper;
    const seatsByTable = seats.reduce((map, seat) => {
        const {guestId, tableId, seatId} = seat;
        if (map[tableId] === undefined) {
            map[tableId] = [];
        }
        map[tableId][seatId] = guestId;
        return map;
    }, {});
    const tablePlan = tablesList.map(table => {
        const seats = seatsByTable[table.id];
        if (seats === undefined) {
            return "";
        }
        const lines = seats.map((guestId, index) => {
            const label = guestId ? guestsMap[guestId] ? GuestUtils.getGuestFullName(guestsMap[guestId]) : `unknown (${guestId})` : "empty";
            return (<tr key={index}><td>#{index + 1}</td><td>{label}</td></tr>)
        })
        return (<table><tr><td colSpan="2">{table.name}</td></tr>{lines}</table>)
    });
    return (<>{tablePlan}</>)

}

export default Plan;