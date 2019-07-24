import React from 'react';
import GuestsList from './GuestsList';
import GuestLineForm from './GuestLineForm.js';
import GuestLine from './GuestLine.js';
import CreateGroupModal from './CreateGroupModal.js';

import {shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16'
import { expect } from 'chai';
import Const from '../utils/const.js'

configure({adapter: new Adapter()});

async function fillGuestLineForm(guestLineForm, firstName, lastName, sex, group) {
    const firstNameInput = guestLineForm.find('#guest-line-form__input--first-name');
    await firstNameInput.simulate('change', { target: { value: firstName } });

    const lastNameInput = guestLineForm.find('#guest-line-form__input--last-name');
    await lastNameInput.simulate('change', { target: { value: lastName } });

    const sexInput = guestLineForm.find('#guest-line-form__input--sex');
    await sexInput.simulate('change', { target: { value: sex} });

    if (group) {
        let groupInput = guestLineForm.find('#guest-line-form__input--group');
        let groupInputValue = Const.NEW_GROUP_OPT;
        groupInput.find('option').forEach(node => {
            if (node.text() === group) {
                groupInputValue = node.prop('value').toString();
            }
        });

        await groupInput.simulate('change', { target: { value: groupInputValue} });

        if (groupInputValue === Const.NEW_GROUP_OPT) {
            expect(guestLineForm.find(CreateGroupModal)).to.have.lengthOf(1);
            const createGroupModal = guestLineForm.find(CreateGroupModal).dive();

            const groupNameInput = createGroupModal.find('#create-group-modal__input--name');
            await groupNameInput.simulate('change', { target: { value: group } });

            const submitInput = createGroupModal.find('#create-group-modal__input--submit');
            await submitInput.simulate('click');
            expect(guestLineForm.find(CreateGroupModal)).to.have.lengthOf(0);
        }
    }
}

async function addGuest(guestListComponent, firstName, lastName, sex, group) {
    //click on add guest button
    const addGuestBtn = guestListComponent.find('#guest-list__add-guest');
    await addGuestBtn.simulate('click');

    //filling form
    const guestLineForm = guestListComponent.find(GuestLineForm).dive();
    await fillGuestLineForm(guestLineForm, firstName, lastName, sex, group);

    //validate
    const submitInput = guestLineForm.find('#guest-line-form__input--submit');
    submitInput.simulate('click');
}

async function editGuest(guestListComponent, guestLine, firstName, lastName, sex, group) {
    //click on edit
    await guestLine.find('.guest-line__btn--edit').simulate('click');
    expect(guestListComponent.find(GuestLineForm)).to.have.lengthOf(1);

    //fill form
    const guestLineForm = guestListComponent.find(GuestLineForm).dive();
    await fillGuestLineForm(guestLineForm, firstName, lastName, sex, group);

    //validate
    const submitInput = guestLineForm.find('#guest-line-form__input--submit');
    await submitInput.simulate('click');
}

function checkGuestLine(guestLine = '', firstName = '', lastName = '', sex = '', group = '') {
    expect(guestLine.find('.guest-line__cell--first-name').text()).to.equal(firstName);
    expect(guestLine.find('.guest-line__cell--last-name').text()).to.equal(lastName);
    expect(guestLine.find('.guest-line__cell--sex').text()).to.equal(sex);
    expect(guestLine.find('.guest-line__cell--group').text()).to.equal(group);
}

test('No guest', () => {
    const guestList = shallow(<GuestsList />);

    expect(guestList.find('tbody').children()).to.have.lengthOf(0);
});

test('Adding a guest', async () => {
    const guestList = shallow(<GuestsList />);
    await addGuest(guestList, 'Pierre', 'Cuni', Const.GENDER.MALE);

    //Checking
    expect(guestList.find(GuestLineForm)).to.have.lengthOf(0);
    expect(guestList.find(GuestLine)).to.have.lengthOf(1);
    const guestLine = guestList.find(GuestLine).dive();
    checkGuestLine(guestLine, 'Pierre', 'Cuni', Const.GENDER.MALE);
});

test('Cancel guest addition', async () => {
    const guestList = shallow(<GuestsList />);

    //click on add guest button
    const addGuestBtn = guestList.find('#guest-list__add-guest');
    await addGuestBtn.simulate('click');
    expect(guestList.find(GuestLineForm)).to.have.lengthOf(1);

    //cancel
    const guestLineForm = guestList.find(GuestLineForm).dive();
    const submitInput = guestLineForm.find('#guest-line-form__input--cancel');
    submitInput.simulate('click');

    //Checking
    expect(guestList.find(GuestLineForm)).to.have.lengthOf(0);
    expect(guestList.find(GuestLine)).to.have.lengthOf(0);
});

test('Editing a guest', async () => {
    const guestList = shallow(<GuestsList />);
    await addGuest(guestList, 'Pierre', 'Cuni', Const.GENDER.MALE);

    let guestLine = guestList.find(GuestLine).dive();
    await editGuest(guestList, guestLine, 'Gwendoline', 'Chevallier', Const.GENDER.FEMALE);

    //Checking
    expect(guestList.find(GuestLineForm)).to.have.lengthOf(0);
    expect(guestList.find(GuestLine)).to.have.lengthOf(1);
    guestLine = guestList.find(GuestLine).dive();
    checkGuestLine(guestLine, 'Gwendoline', 'Chevallier', Const.GENDER.FEMALE);
});

test('Creating a group while adding a guest', async () => {
    const guestList = shallow(<GuestsList />);
    await addGuest(guestList, 'Pierre', 'Cuni', Const.GENDER.MALE, 'Group1');

    //Checking
    expect(guestList.find(GuestLineForm)).to.have.lengthOf(0);
    expect(guestList.find(GuestLine)).to.have.lengthOf(1);
    const guestLine = guestList.find(GuestLine).dive();
    checkGuestLine(guestLine, 'Pierre', 'Cuni', Const.GENDER.MALE, 'Group1');
});

test('Editing a guest\'s group', async () => {
    const guestList = shallow(<GuestsList />);
    await addGuest(guestList, 'Pierre', 'Cuni', Const.GENDER.MALE, 'Group1');
    let firstGuestLine = guestList.find(GuestLine).dive();

    await addGuest(guestList, 'Gwendoline', 'Chevallier', Const.GENDER.FEMALE, 'Group2');
    await editGuest(guestList, firstGuestLine, 'Pierre', 'Cuni', Const.GENDER.MALE, 'Group2')

    //Checking
    expect(guestList.find(GuestLineForm)).to.have.lengthOf(0);
    expect(guestList.find(GuestLine)).to.have.lengthOf(2);
    firstGuestLine = guestList.find(GuestLine).first().dive();
    checkGuestLine(firstGuestLine, 'Pierre', 'Cuni', Const.GENDER.MALE, 'Group2');
});

test('Creating a group while editing a guest', async () => {
    const guestList = shallow(<GuestsList />);
    await addGuest(guestList, 'Pierre', 'Cuni', Const.GENDER.MALE, 'Group1');
    let guestLine = guestList.find(GuestLine).dive();

    await editGuest(guestList, guestLine, 'Pierre', 'Cuni', Const.GENDER.MALE, 'Group2')

    //Checking
    expect(guestList.find(GuestLineForm)).to.have.lengthOf(0);
    expect(guestList.find(GuestLine)).to.have.lengthOf(1);
    guestLine = guestList.find(GuestLine).first().dive();
    checkGuestLine(guestLine, 'Pierre', 'Cuni', Const.GENDER.MALE, 'Group2');
});

test('Cancel guest edition', async () => {
    const guestList = shallow(<GuestsList />);
    await addGuest(guestList, 'Pierre', 'Cuni', Const.GENDER.MALE, 'Group1');
    let guestLine = guestList.find(GuestLine).dive();

    //click on edit
    await guestLine.find('.guest-line__btn--edit').simulate('click');
    expect(guestList.find(GuestLineForm)).to.have.lengthOf(1);

    //validate
    const guestLineForm = guestList.find(GuestLineForm).dive();
    const submitInput = guestLineForm.find('#guest-line-form__input--cancel');
    await submitInput.simulate('click');

    //Checking
    expect(guestList.find(GuestLineForm)).to.have.lengthOf(0);
    expect(guestList.find(GuestLine)).to.have.lengthOf(1);
    guestLine = guestList.find(GuestLine).first().dive();
    checkGuestLine(guestLine, 'Pierre', 'Cuni', Const.GENDER.MALE, 'Group1');
});

test('Deleting a guest', async () => {
    const guestList = shallow(<GuestsList />);

    //addition
    await addGuest(guestList, 'Pierre', 'Cuni', Const.GENDER.MALE);
    expect(guestList.find(GuestLineForm)).to.have.lengthOf(0);
    expect(guestList.find(GuestLine)).to.have.lengthOf(1);

    //deletion
    let guestLine = guestList.find(GuestLine).dive();
    await guestLine.find('.guest-line__btn--delete').simulate('click');

    //Checking
    expect(guestList.find(GuestLineForm)).to.have.lengthOf(0);
    expect(guestList.find(GuestLine)).to.have.lengthOf(0);
});


































