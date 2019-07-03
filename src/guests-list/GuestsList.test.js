import React from 'react';
import GuestsList from './GuestsList';
import GuestLineForm from './GuestLineForm.js';
import GuestLine from './GuestLine.js';
import {shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16'
import { expect } from 'chai';
import Const from '../utils/const.js'

configure({adapter: new Adapter()});

function fillGuestLineForm(guestLineForm, firstName, lastName, sexe, group) {
    const firstNameInput = guestLineForm.find('#guest-line-form__input--first-name');
    firstNameInput.simulate('change', { target: { value: firstName } });
    const lastNameInput = guestLineForm.find('#guest-line-form__input--last-name');
    lastNameInput.simulate('change', { target: { value: lastName } });
    const sexeInput = guestLineForm.find('#guest-line-form__input--sexe');
    sexeInput.simulate('change', { target: { value: sexe} });
    if (group) {
        const groupInput = guestLineForm.find('#guest-line-form__input--group');
        groupInput.simulate('change', { target: { value: Const.NEW_GROUP_OPT} });
    }
}

function addGuest(guestListComponent, firstName, lastName, sexe, group) {
    //click on add guest button
    const addGuestBtn = guestListComponent.find('#guest-list__add-guest');
    addGuestBtn.simulate('click');

    //filling form
    const guestLineForm = guestListComponent.find(GuestLineForm).dive();
    fillGuestLineForm(guestLineForm, firstName, lastName, sexe, group);

    //validate
    const submitInput = guestLineForm.find('#guest-line-form__input--submit');
    submitInput.simulate('click');
}

function editGuest(guestListComponent, guestLine, firstName, lastName, sexe, group) {
    //click on edit
    guestLine.find('#guest-line__btn--edit').simulate('click');
    expect(guestListComponent.find(GuestLineForm)).to.have.lengthOf(1);
    expect(guestListComponent.find(GuestLine)).to.have.lengthOf(0);

    //fill form
    const guestLineForm = guestListComponent.find(GuestLineForm).dive();
    fillGuestLineForm(guestLineForm, firstName, lastName, sexe, group);

    //validate
    const submitInput = guestLineForm.find('#guest-line-form__input--submit');
    submitInput.simulate('click');
}

function checkGuestLine(guestLine, firstName, lastName, sexe, group) {
    expect(guestLine.find('.guest-line__cell--first-name').text()).to.equal(firstName);
    expect(guestLine.find('.guest-line__cell--last-name').text()).to.equal(lastName);
    expect(guestLine.find('.guest-line__cell--sexe').text()).to.equal(sexe);
}

test('No guest', () => {
    const guestList = shallow(<GuestsList />);

    expect(guestList.find('tbody').children()).to.have.lengthOf(0);
});

test('Adding a guest', () => {
    const guestList = shallow(<GuestsList />);
    addGuest(guestList, 'Pierre', 'Cuni', Const.GENDER.MALE);

    //Checking
    expect(guestList.find(GuestLineForm)).to.have.lengthOf(0);
    expect(guestList.find(GuestLine)).to.have.lengthOf(1);
    const guestLine = guestList.find(GuestLine).dive();
    checkGuestLine(guestLine, 'Pierre', 'Cuni', Const.GENDER.MALE);
});

test('Editing a guest', () => {
    const guestList = shallow(<GuestsList />);
    addGuest(guestList, 'Pierre', 'Cuni', Const.GENDER.MALE);

    let guestLine = guestList.find(GuestLine).dive();
    editGuest(guestList, guestLine, 'Gwendoline', 'Chevallier', Const.GENDER.FEMALE);

    //Checking
    expect(guestList.find(GuestLineForm)).to.have.lengthOf(0);
    expect(guestList.find(GuestLine)).to.have.lengthOf(1);
    guestLine = guestList.find(GuestLine).dive();
    checkGuestLine(guestLine, 'Gwendoline', 'Chevallier', Const.GENDER.FEMALE);
});

test('Creating a group while adding a guest', () => {
    const guestList = shallow(<GuestsList />);
    addGuest(guestList, 'Pierre', 'Cuni', Const.GENDER.MALE, 'Group1');

});



































