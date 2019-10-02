import React from 'react';

const Plan = (props) => {
    return (
        <section id="plan">
            <h1>Table Plan</h1>
            {props.error ? (<div>{props.plan}</div>) : <div>{props.error}</div>}
            <button
                id="plan__generate"
                type="button"
                onClick={_ => props.generatePlan()}>
                Generate Plan
            </button>
        </section>
    );
};

export default Plan;