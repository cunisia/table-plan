import React from 'react';
import {shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16'
import { expect } from 'chai';
import Const from '../utils/const.js'

import TablesList from './TablesList.js'
import TableLine from './TableLine.js'
import TableLineForm from './TableLineForm.js'
import TableUtils from './TableUtils.js'

configure({adapter: new Adapter()});

async function fillTableLineForm(tableLineForm, tableName, isCircle, seatsWidth, seatsHeight) {
    const nameInput = tableLineForm.find('#table-line-form__input--name');
    await nameInput.simulate('change', { target: { value: tableName } });

    const isCircleInput = tableLineForm.find('#table-line-form__select--is-circle');
    await isCircleInput.simulate('change', { target: { value: isCircle.toString() } });

    const seatsWidthInput = tableLineForm.find('#table-line-form__input--seats-with');
    await seatsWidthInput.simulate('change', { target: { value: seatsWidth} });

    if (!isCircle) {
        const seatsHeightInput = tableLineForm.find('#table-line-form__input--seats-height');
        await seatsHeightInput.simulate('change', { target: { value: seatsHeight} });
    }
}

async function addTable(tablesListComponent, tableName, isCircle, seatsWidth, seatsHeight) {
    //click on add table button
    const addTableBtn = tablesListComponent.find('#tables-list__add-table');
    await addTableBtn.simulate('click');

    //filling form
    const tableLineForm = tablesListComponent.find(TableLineForm).dive();
    await fillTableLineForm(tableLineForm, tableName, isCircle, seatsWidth, seatsHeight);

    //validate
    const submitInput = tableLineForm.find('#table-line-form__input--submit');
    submitInput.simulate('click');
}

async function editTable(tablesListComponent, tableLineComponent, tableName, isCircle, seatsWidth, seatsHeight) {
    //click on edit
    await tableLineComponent.find('.table-line__btn--edit').simulate('click');
    expect(tablesListComponent.find(TableLineForm)).to.have.lengthOf(1);

    //fill form
    const tableLineForm = tablesListComponent.find(TableLineForm).dive();
    await fillTableLineForm(tableLineForm, tableName, isCircle, seatsWidth, seatsHeight);

    //validate
    const submitInput = tableLineForm.find('#table-line-form__input--submit');
    await submitInput.simulate('click');
}

function checkTableLine(tableLine, tableName = '', isCircle = false, seatsWidth=0, seatsHeight =0) {
    expect(tableLine.find('.table-line__cell--name').text()).to.equal(tableName);
    expect(tableLine.find('.table-line__cell--shape').text()).to.equal(TableUtils.getShapeLabel(isCircle, seatsWidth, seatsHeight));
    expect(tableLine.find('.table-line__cell--nb-seats').text()).to.equal(TableUtils.getNbSeats(isCircle, seatsWidth, seatsHeight).toString());
}

test('No table', () => {
    const tableList = shallow(<TablesList />);

    expect(tableList.find('tbody').children()).to.have.lengthOf(0);
});

test('Adding a table', async () => {
    const tableList = shallow(<TablesList />);
    await addTable(tableList, 'Test Table', false, 5, 3);

    //Checking
    expect(tableList.find(TableLineForm)).to.have.lengthOf(0);
    expect(tableList.find(TableLine)).to.have.lengthOf(1);
    const tableLine = tableList.find(TableLine).dive();
    checkTableLine(tableLine, 'Test Table', false, 5, 3);
});

test('Cancel table addition', async () => {
    const tableList = shallow(<TablesList />);

    //click on add table button
    const addTableBtn = tableList.find('#tables-list__add-table');
    await addTableBtn.simulate('click');
    expect(tableList.find(TableLineForm)).to.have.lengthOf(1);

    //cancel
    const tableLineForm = tableList.find(TableLineForm).dive();
    const submitInput = tableLineForm.find('#table-line-form__input--cancel');
    submitInput.simulate('click');

    //Checking
    expect(tableList.find(TableLineForm)).to.have.lengthOf(0);
    expect(tableList.find(TableLine)).to.have.lengthOf(0);
});

test('Editing a table', async () => {
    const tableList = shallow(<TablesList />);
    await addTable(tableList, 'Test Table', false, 5, 3);

    let tableLine = tableList.find(TableLine).dive();
    await editTable(tableList, tableLine, 'Test Table 2', true, 16);

    //Checking
    expect(tableList.find(TableLineForm)).to.have.lengthOf(0);
    expect(tableList.find(TableLine)).to.have.lengthOf(1);
    tableLine = tableList.find(TableLine).dive();
    checkTableLine(tableLine, 'Test Table 2', true, 16);
});

test('Cancel table edition', async () => {
    const tableList = shallow(<TablesList />);
    await addTable(tableList, 'Test Table', false, 5, 3);
    let tableLine = tableList.find(TableLine).dive();

    //click on edit
    await tableLine.find('.table-line__btn--edit').simulate('click');
    expect(tableList.find(TableLineForm)).to.have.lengthOf(1);

    //validate
    const tableLineForm = tableList.find(TableLineForm).dive();
    const submitInput = tableLineForm.find('#table-line-form__input--cancel');
    await submitInput.simulate('click');

    //Checking
    expect(tableList.find(TableLineForm)).to.have.lengthOf(0);
    expect(tableList.find(TableLine)).to.have.lengthOf(1);
    tableLine = tableList.find(TableLine).first().dive();
    checkTableLine(tableLine, 'Test Table', false, 5, 3);
});

test('Deleting a table', async () => {
    const tableList = shallow(<TablesList />);

    //addition
    await addTable(tableList, 'Test Table', false, 5, 3);
    expect(tableList.find(TableLineForm)).to.have.lengthOf(0);
    expect(tableList.find(TableLine)).to.have.lengthOf(1);

    //deletion
    let tableLine = tableList.find(TableLine).dive();
    await tableLine.find('.table-line__btn--delete').simulate('click');

    //Checking
    expect(tableList.find(TableLineForm)).to.have.lengthOf(0);
    expect(tableList.find(TableLine)).to.have.lengthOf(0);
});

test('Copying a table', async () => {
    const tableList = shallow(<TablesList />);

    //addition
    await addTable(tableList, 'Test Table', false, 5, 3);
    expect(tableList.find(TableLineForm)).to.have.lengthOf(0);
    expect(tableList.find(TableLine)).to.have.lengthOf(1);

    //deletion
    let tableLine = tableList.find(TableLine).dive();
    await tableLine.find('.table-line__btn--copy').simulate('click');

    //Checking
    expect(tableList.find(TableLineForm)).to.have.lengthOf(0);
    expect(tableList.find(TableLine)).to.have.lengthOf(2);
    checkTableLine(tableList.find(TableLine).at(0).dive(), 'Test Table', false, 5, 3);
    checkTableLine(tableList.find(TableLine).at(1).dive(), 'Test Table', false, 5, 3);
});


































