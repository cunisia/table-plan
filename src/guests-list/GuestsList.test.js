import React from 'react';
import { createStore } from 'redux';

import { getByText } from '@testing-library/dom';
import { render, cleanup, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import tablePlanReducer from '../store/reducers';
import Const from '../utils/const.js'
import GuestsListContainer from './GuestsListContainer';

async function fillGuestLineForm(rendered, firstName, lastName, sex, group) {
    const firstNameInput = rendered.getByPlaceholderText('First Name');
    await fireEvent.change(firstNameInput, { target: { value: firstName }});

    const lastNameInput = rendered.getByPlaceholderText('Last Name', {exact: false});
    await fireEvent.change(lastNameInput, { target: { value: lastName }});

    const sexInput = rendered.getByTestId('guest-line-form__input--sex');
    await fireEvent.change(sexInput, { target: { value: sex }});

    if (group) {
        const groupInput = rendered.getByTestId('guest-line-form__input--group');
        let groupInputValue = Const.NEW_GROUP_OPT;
        groupInput.querySelectorAll('option').forEach(node => {
            if (node.text === group) {
                groupInputValue = node.getAttribute('value').toString();
            }
        });

        groupInput.value = groupInputValue;
        await fireEvent.change(groupInput);

        if (groupInputValue === Const.NEW_GROUP_OPT) {
            const dialog = rendered.container.querySelector('dialog');
            expect(rendered.container.querySelector('dialog')).not.toBeNull();

            const groupNameInput = rendered.getByPlaceholderText('Group Name', {exact: false});
            await fireEvent.change(groupNameInput, { target: { value: group }});

            const submitInput = rendered.getByText('Save', {exact: false});
            await fireEvent.click(submitInput);
            expect(rendered.container.querySelector('dialog')).toBeNull();
        }
    }
}

async function addGuest(rendered, firstName, lastName, sex, group) {
    //click on add guest button
    await fireEvent.click(rendered.getByText('Add guest', {exact: false}));

    //filling form
    await fillGuestLineForm(rendered, firstName, lastName, sex, group);

    //validate
    fireEvent.click(rendered.getByText('Ok', {exact: false}))
}

async function editGuest(rendered, guestLine, firstName, lastName, sex, group) {
    //click on edit
    await fireEvent.click(getByText(guestLine, 'Edit', {exact: false}));

    //fill form
    await fillGuestLineForm(rendered, firstName, lastName, sex, group);

    //validate
    fireEvent.click(rendered.getByText('Ok', {exact: false}))
}

function checkGuestLine(guestLine, firstName = '', lastName = '', sex = '', group = '') {
    expect(guestLine.querySelector('.guest-line__cell--first-name').innerHTML).toBe(firstName);
    expect(guestLine.querySelector('.guest-line__cell--last-name').innerHTML).toBe(lastName);
    expect(guestLine.querySelector('.guest-line__cell--sex').innerHTML).toBe(sex);
    expect(guestLine.querySelector('.guest-line__cell--group').innerHTML).toBe(group);
}

describe('GuestsListContainer component', () => {

    let store, rendered;

    const modalRoot = document.createElement('div');
    modalRoot.setAttribute('id', 'modal-wrapper');

    beforeEach(() => {
        store = createStore(tablePlanReducer);
        rendered = render(<GuestsListContainer store={store} />, {
            container: document.body.appendChild(modalRoot)
        });
    });

    afterEach(() => {
        cleanup();
    });

    it('No guest', () => {
        expect(rendered.container.querySelector('tbody').children).toHaveLength(0);
    });

    it('Adding a guest', async () => {
        await addGuest(rendered, 'Pierre', 'Cuni', Const.GENDER.MALE);

        //Checking
        expect(rendered.container.querySelector('.guest-line-form')).toBeNull();
        expect(rendered.container.querySelector('.guest-line')).not.toBeNull();
        checkGuestLine(rendered.container.querySelector('.guest-line'), 'Pierre', 'Cuni', Const.GENDER.MALE);
    });

    it('Cancel guest addition', async () => {
        //click on add guest button
        await fireEvent.click(rendered.getByText('Add guest', {exact: false}));
        expect(rendered.container.querySelector('.guest-line-form')).not.toBeNull();

        //cancel
        await fireEvent.click(rendered.getByText('Cancel', {exact: false}));

        //Checking
        expect(rendered.container.querySelector('.guest-line-form')).toBeNull();
        expect(rendered.container.querySelector('.guest-line')).toBeNull();
    });

    it('Editing a guest', async () => {
        await addGuest(rendered, 'Pierre', 'Cuni', Const.GENDER.MALE);
        await editGuest(rendered, rendered.container.querySelectorAll(".guest-line")[0], 'Gwendoline', 'Chevallier', Const.GENDER.FEMALE);

        //Checking
        expect(rendered.container.querySelector('.guest-line-form')).toBeNull();
        expect(rendered.container.querySelector('.guest-line')).not.toBeNull();
        checkGuestLine(rendered.container.querySelector('.guest-line'), 'Gwendoline', 'Chevallier', Const.GENDER.FEMALE);
    });

    it('Creating a group while adding a guest', async () => {
        await addGuest(rendered, 'Pierre', 'Cuni', Const.GENDER.MALE, 'Group1');

        //Checking
        expect(rendered.container.querySelector('.guest-line-form')).toBeNull();
        expect(rendered.container.querySelector('.guest-line')).not.toBeNull();
        checkGuestLine(rendered.container.querySelector('.guest-line'), 'Pierre', 'Cuni', Const.GENDER.MALE, 'Group1');
    });

    it('Editing a guest\'s group', async () => {
        await addGuest(rendered, 'Pierre', 'Cuni', Const.GENDER.MALE, 'Group1');
        await addGuest(rendered, 'Gwendoline', 'Chevallier', Const.GENDER.FEMALE, 'Group2');
        await editGuest(rendered, rendered.container.querySelectorAll(".guest-line")[0], 'Pierre', 'Cuni', Const.GENDER.MALE, 'Group2')

        //Checking
        expect(rendered.container.querySelector('.guest-line-form')).toBeNull();
        expect(rendered.container.querySelectorAll('.guest-line')).toHaveLength(2);
        checkGuestLine(rendered.container.querySelectorAll(".guest-line")[0], 'Pierre', 'Cuni', Const.GENDER.MALE, 'Group2');
    });

    it('Creating a group while editing a guest', async () => {
        await addGuest(rendered, 'Pierre', 'Cuni', Const.GENDER.MALE, 'Group1');
        await editGuest(rendered, rendered.container.querySelector('.guest-line'), 'Pierre', 'Cuni', Const.GENDER.MALE, 'Group2')

        //Checking
        expect(rendered.container.querySelector('.guest-line-form')).toBeNull();
        expect(rendered.container.querySelector('.guest-line')).not.toBeNull();
        checkGuestLine(rendered.container.querySelector('.guest-line'), 'Pierre', 'Cuni', Const.GENDER.MALE, 'Group2');
    });

    it('Cancel guest edition', async () => {
        await addGuest(rendered, 'Pierre', 'Cuni', Const.GENDER.MALE, 'Group1');

        //click on edit
        await fireEvent.click(rendered.getByText("Edit", {exact: false}));
        expect(rendered.container.querySelector('.guest-line-form')).not.toBeNull();

        //validate
        await fireEvent.click(rendered.getByText("Cancel", {exact: false}));

        //Checking
        expect(rendered.container.querySelector('.guest-line-form')).toBeNull();
        expect(rendered.container.querySelector('.guest-line')).not.toBeNull();
        checkGuestLine(rendered.container.querySelector('.guest-line'), 'Pierre', 'Cuni', Const.GENDER.MALE, 'Group1');
    });

    test('Deleting a guest', async () => {
        //addition
        await addGuest(rendered, 'Pierre', 'Cuni', Const.GENDER.MALE);
        expect(rendered.container.querySelector('.guest-line-form')).toBeNull();
        expect(rendered.container.querySelector('.guest-line')).not.toBeNull();

        //deletion
        await fireEvent.click(rendered.getByText("Delete", {exact: false}));

        //Checking
        expect(rendered.container.querySelector('.guest-line-form')).toBeNull();
        expect(rendered.container.querySelector('.guest-line')).toBeNull();
    });
});


































