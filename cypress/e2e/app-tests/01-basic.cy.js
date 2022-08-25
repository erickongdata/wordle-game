/// <reference types="cypress" />

describe('page renders correctly', () => {
  before(() => {
    cy.visit('http://localhost:5173/');
  });
  it('page renders all components', () => {
    cy.contains('Wordle').should('exist');
    cy.get('[data-id="custom-word-btn"]').should('exist');
    cy.get('[data-id="mode-btn"]').should('exist');
    cy.get('[data-id="help-btn"]').should('exist');
    cy.get('[data-id="quit-btn"]').should('exist');
    cy.get('[data-id="tile-0-0"]').should('exist');
    cy.get('[data-id="tile-5-4"]').should('exist');
    cy.get('.tile').should('have.length', 30);
    cy.get('.key-tile').should('have.length', 28);
    cy.get('[data-key="Q"]').should('exist');
    cy.get('[data-key="M"]').should('exist');
    cy.get('[data-key="Enter"]').should('exist');
    cy.get('[data-key="Backspace"]').should('exist');
  });

  it('quit button is not visible', () => {
    cy.get('[data-id="quit-btn"]').should('have.css', 'display', 'none');
    cy.get('[data-id="quit-btn"]').should('not.be.visible');
  });

  it('grid is blank', () => {
    cy.get('[data-id="tile-0-0"]').should('have.text', '');
    cy.get('[data-id="tile-5-4"]').should('have.text', '');

    cy.get('.absent').should('not.exist');
    cy.get('.present').should('not.exist');
    cy.get('.correct').should('not.exist');
    cy.get('.flipped-correct').should('not.exist');
  });
});

describe('menu buttons work', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/');
  });

  it('custom word button works', () => {
    cy.get('[data-id="word-container"]').should('not.be.visible');
    cy.get('[data-id="custom-word-btn"]').click();
    cy.get('[data-id="word-container"]').should('be.visible');
    cy.get('[data-id="word-close-btn"]').click();
    cy.get('[data-id="word-container"]').should('not.be.visible');
  });

  it('help button works', () => {
    cy.get('[data-id="help-container"]').should('not.be.visible');
    cy.get('[data-id="help-btn"]').click();
    cy.get('[data-id="help-container"]').should('be.visible');
    cy.get('[data-id="help-close-btn"]').click();
    cy.get('[data-id="help-container"]').should('not.be.visible');
  });

  it('settings button works', () => {
    cy.get('[data-id="settings-container"]').should('not.be.visible');
    cy.get('[data-id="settings-btn"]').click();
    cy.get('[data-id="settings-container"]').should('be.visible');
    cy.get('[data-id="settings-close-btn"]').click();
    cy.get('[data-id="settings-container"]').should('not.be.visible');
  });
});

describe('Key input and keyboard works', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/');
  });

  it('physical key input works', () => {
    cy.get('body').type('s');
    cy.get('[data-id="tile-0-0"]').should('have.text', 'S');
    cy.get('body').type('p');
    cy.get('[data-id="tile-0-1"]').should('have.text', 'P');
    cy.get('body').type('e');
    cy.get('[data-id="tile-0-2"]').should('have.text', 'E');
    cy.get('body').type('a');
    cy.get('[data-id="tile-0-3"]').should('have.text', 'A');
    cy.get('body').type('k');
    cy.get('[data-id="tile-0-4"]').should('have.text', 'K');
    cy.get('body').type('{backspace}');
    cy.get('[data-id="tile-0-4"]').should('have.text', '');
    cy.get('body').type('{backspace}');
    cy.get('[data-id="tile-0-3"]').should('have.text', '');
    cy.get('body').type('{backspace}');
    cy.get('[data-id="tile-0-2"]').should('have.text', '');
    cy.get('body').type('{backspace}');
    cy.get('[data-id="tile-0-1"]').should('have.text', '');
    cy.get('body').type('{backspace}');
    cy.get('[data-id="tile-0-0"]').should('have.text', '');
  });

  it('virtual keyboard input works', () => {
    cy.get('[data-key="S"]').click();
    cy.get('[data-id="tile-0-0"]').should('have.text', 'S');
    cy.get('[data-key="P"]').click();
    cy.get('[data-id="tile-0-1"]').should('have.text', 'P');
    cy.get('[data-key="E"]').click();
    cy.get('[data-id="tile-0-2"]').should('have.text', 'E');
    cy.get('[data-key="A"]').click();
    cy.get('[data-id="tile-0-3"]').should('have.text', 'A');
    cy.get('[data-key="K"]').click();
    cy.get('[data-id="tile-0-4"]').should('have.text', 'K');
    cy.get('[data-key="Backspace"]').click();
    cy.get('[data-id="tile-0-4"]').should('have.text', '');
    cy.get('[data-key="Backspace"]').click();
    cy.get('[data-id="tile-0-3"]').should('have.text', '');
    cy.get('[data-key="Backspace"]').click();
    cy.get('[data-id="tile-0-2"]').should('have.text', '');
    cy.get('[data-key="Backspace"]').click();
    cy.get('[data-id="tile-0-1"]').should('have.text', '');
    cy.get('[data-key="Backspace"]').click();
    cy.get('[data-id="tile-0-0"]').should('have.text', '');
  });
});
