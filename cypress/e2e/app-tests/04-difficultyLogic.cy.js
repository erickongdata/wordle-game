/// <reference types="cypress" />

describe('Revealed letters must be used message show', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/');
    cy.intercept('https://api.dictionaryapi.dev/api/v2/entries/en/**', {}).as(
      'dictAPI'
    );

    cy.get('[data-id="custom-word-btn"]').click();
    cy.get('[data-id="word-input"]').type('baker{enter}');
    cy.get('[data-id="settings-btn"]').click();
    cy.get('[data-id="mode-btn-slider"]').click();
    cy.get('[data-id="settings-close-btn"]').click();
  });

  it('on hard mode, correct letters must be used', () => {
    cy.get('body')
      .type('{b}{o}{o}{l}{s}{enter}')
      .type('{c}{o}{o}{l}{s}{enter}');
    cy.get('[data-id="message"]')
      .should('be.visible')
      .should('contain.text', 'revealed');
  });

  it('on hard mode, present letters must be used', () => {
    cy.get('body')
      .type('{c}{o}{o}{k}{s}{enter}')
      .type('{c}{o}{o}{l}{s}{enter}');
    cy.get('[data-id="message"]')
      .should('be.visible')
      .should('contain.text', 'revealed');
  });

  it('on hard mode, present letters can be used in any place', () => {
    cy.get('body')
      .type('{c}{o}{o}{k}{s}{enter}')
      .type('{k}{i}{t}{e}{s}{enter}')
      .type('{z}');
    cy.get('[data-id="tile-2-0"]').should('have.text', 'Z');
  });

  it('on hard mode, correct letters must be used in the same place', () => {
    cy.get('body')
      .type('{b}{o}{o}{l}{s}{enter}')
      .type('{c}{a}{b}{i}{n}{enter}');
    cy.get('[data-id="message"]')
      .should('be.visible')
      .should('contain.text', 'revealed')
      .should('contain.text', 'places');
  });
});
