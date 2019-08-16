import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import { getByText } from '@testing-library/dom';
import { render, cleanup, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import tablePlanReducer from '../store/reducers';
import TablesListContainer from './TablesListContainer.js'
import TableUtils from './TableUtils.js'

async function fillTableLineForm(rendered, tableName, isCircle, seatsWidth, seatsHeight) {
    const nameInput = rendered.getByPlaceholderText('Name');
    await fireEvent.change(nameInput, { target: { value: tableName } });

    const isCircleInput = rendered.getByTestId('table-line-form__select--is-circle');
    await fireEvent.change(isCircleInput, { target: { value: isCircle.toString() } });

    const seatsWidthInput = rendered.getByTestId('table-line-form__input--seats-with');
    await fireEvent.change(seatsWidthInput, { target: { value: seatsWidth} });

    if (!isCircle) {
        const seatsHeightInput = rendered.getByTestId('table-line-form__input--seats-height');
        await fireEvent.change(seatsHeightInput, { target: { value: seatsHeight} });
    }
}

async function addTable(rendered, tableName, isCircle, seatsWidth, seatsHeight) {
    //click on add table button
    await fireEvent.click(rendered.getByText("Add table", {exact: false}));

    //filling form
    await fillTableLineForm(rendered, tableName, isCircle, seatsWidth, seatsHeight);

    //validate
    await fireEvent.click(getByText(rendered.container.querySelector('.table-line-form'), "Ok", {exact: false}));
}

async function editTable(rendered, tableLine, tableName, isCircle, seatsWidth, seatsHeight) {
    //click on edit
    await fireEvent.click(getByText(tableLine, 'Edit', {exact: false}));
    const tableLineForm = rendered.container.querySelector('.table-line-form');
    expect(tableLineForm).not.toBeNull();

    //fill form
    await fillTableLineForm(rendered, tableName, isCircle, seatsWidth, seatsHeight);

    //validate
    await fireEvent.click(getByText(tableLineForm, 'Ok', {exact: false}));
}

function checkTableLine(tableLine, tableName = '', isCircle = false, seatsWidth=0, seatsHeight =0) {
    expect(tableLine.querySelector('.table-line__cell--name').innerHTML).toBe(tableName);
    expect(tableLine.querySelector('.table-line__cell--shape').innerHTML).toBe(TableUtils.getShapeLabel(isCircle, seatsWidth, seatsHeight));
    expect(tableLine.querySelector('.table-line__cell--nb-seats').innerHTML).toBe(TableUtils.getNbSeats(isCircle, seatsWidth, seatsHeight).toString());
}

describe('TablesListContainer component', () => {
    let store, rendered;

    beforeEach(() => {
        store = createStore(tablePlanReducer);
        rendered = render(<Provider store={store}><TablesListContainer /></Provider>);
    });

    afterEach(() => {
        cleanup();
    });

    it('No table', () => {
        const { container } = render(<TablesListContainer store={store} />);
        expect(container.querySelector('tbody').children).toHaveLength(0);
    });

    it('Adding a table', async () => {
        await addTable(rendered, 'Test Table', false, 5, 3);

        //Checking
        expect(rendered.container.querySelector('.table-line-form')).toBeNull();
        expect(rendered.container.querySelector('.table-line')).not.toBeNull();
        checkTableLine(rendered.container.querySelector('.table-line'), 'Test Table', false, 5, 3);
    });

    it('Cancel table addition', async () => {
        //click on add table button
        await fireEvent.click(rendered.getByText("Add table", {exact: false}));
        expect(rendered.container.querySelector('.table-line-form')).not.toBeNull();

        //cancel
        await fireEvent.click(getByText(rendered.container.querySelector('.table-line-form'), "Cancel", {exact: false}));

        //Checking
        expect(rendered.container.querySelector('.table-line-form')).toBeNull();
        expect(rendered.container.querySelector('.table-line')).toBeNull();
    });

    it('Editing a table', async () => {
        await addTable(rendered, 'Test Table', false, 5, 3);

        await editTable(rendered, rendered.container.querySelector('.table-line'), 'Test Table 2', true, 16);

        //Checking
        expect(rendered.container.querySelector('.table-line-form')).toBeNull();
        expect(rendered.container.querySelector('.table-line')).not.toBeNull();
        checkTableLine(rendered.container.querySelector('.table-line'), 'Test Table 2', true, 16);
    });

    it('Cancel table edition', async () => {
        await addTable(rendered, 'Test Table', false, 5, 3);

        //click on edit
        await fireEvent.click(getByText(rendered.container.querySelector('.table-line'), "Edit", {exact: false}));
        expect(rendered.container.querySelector('.table-line-form')).not.toBeNull();
        expect(rendered.container.querySelector('.table-line')).toBeNull();

        //cancel
        await fireEvent.click(getByText(rendered.container.querySelector('.table-line-form'), "Cancel", {exact: false}));

        //Checking
        expect(rendered.container.querySelector('.table-line-form')).toBeNull();
        expect(rendered.container.querySelector('.table-line')).not.toBeNull();
        checkTableLine(rendered.container.querySelector('.table-line'), 'Test Table', false, 5, 3);
    });

    it('Deleting a table', async () => {
        //addition
        await addTable(rendered, 'Test Table', false, 5, 3);
        expect(rendered.container.querySelector('.table-line-form')).toBeNull();
        expect(rendered.container.querySelector('.table-line')).not.toBeNull();

        //deletion
        await fireEvent.click(getByText(rendered.container.querySelector('.table-line'), "Delete", {exact: false}));

        //Checking
        expect(rendered.container.querySelector('.table-line-form')).toBeNull();
        expect(rendered.container.querySelector('.table-line')).toBeNull();
    });

    it('Copying a table', async () => {
        //addition
        await addTable(rendered, 'Test Table', false, 5, 3);
        expect(rendered.container.querySelector('.table-line-form')).toBeNull();
        expect(rendered.container.querySelector('.table-line')).not.toBeNull();

        //copying
        await fireEvent.click(getByText(rendered.container.querySelector('.table-line'), "Copy", {exact: false}));

        //Checking
        expect(rendered.container.querySelector('.table-line-form')).toBeNull();
        const tableLines = rendered.container.querySelectorAll('.table-line');
        expect(tableLines).toHaveLength(2);
        checkTableLine(tableLines[0], 'Test Table', false, 5, 3);
        checkTableLine(tableLines[1], 'Test Table', false, 5, 3);
    });

});