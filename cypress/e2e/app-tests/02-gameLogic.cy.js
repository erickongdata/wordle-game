/// <reference types="cypress" />

describe('basic game logic check', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/');
    cy.intercept('https://api.dictionaryapi.dev/api/v2/entries/en/**', {}).as(
      'dictAPI'
    );
  });

  it('custom word input works', () => {
    cy.get('[data-id="custom-word-btn"]').click();
    cy.get('[data-id="word-input"]')
      .type('baker')
      .should('have.value', 'baker')
      .type('{enter}')
      .should('not.be.visible');
    cy.get('body').type('{b}');
    cy.get('[data-id="tile-0-0"]').should('have.text', 'B');
    cy.get('body').type('{a}{k}{e}{r}{enter}');
    cy.get('[data-id="tile-0-0"]').should('have.class', 'correct');
    cy.get('[data-id="tile-0-0"]').should('not.have.class', 'present');
    cy.get('[data-id="tile-0-0"]').should('not.have.class', 'absent');
    cy.get('[data-id="tile-0-1"]').should('have.class', 'correct');
    cy.get('[data-id="tile-0-1"]').should('not.have.class', 'present');
    cy.get('[data-id="tile-0-1"]').should('not.have.class', 'absent');
    cy.get('[data-id="tile-0-2"]').should('have.class', 'correct');
    cy.get('[data-id="tile-0-2"]').should('not.have.class', 'present');
    cy.get('[data-id="tile-0-2"]').should('not.have.class', 'absent');
    cy.get('[data-id="tile-0-3"]').should('have.class', 'correct');
    cy.get('[data-id="tile-0-3"]').should('not.have.class', 'present');
    cy.get('[data-id="tile-0-3"]').should('not.have.class', 'absent');
    cy.get('[data-id="tile-0-4"]').should('have.class', 'correct');
    cy.get('[data-id="tile-0-4"]').should('not.have.class', 'present');
    cy.get('[data-id="tile-0-4"]').should('not.have.class', 'absent');

    cy.get('[data-key="B"]').should('have.class', 'correct');
    cy.get('[data-key="A"]').should('have.class', 'correct');
    cy.get('[data-key="K"]').should('have.class', 'correct');
    cy.get('[data-key="E"]').should('have.class', 'correct');
    cy.get('[data-key="R"]').should('have.class', 'correct');
  });

  it('wrong letters show dark tiles', () => {
    cy.get('[data-id="custom-word-btn"]').click();
    cy.get('[data-id="word-input"]').type('baker{enter}');
    cy.get('body').type('{c}{o}{l}{d}{s}{enter}');
    cy.get('[data-id="tile-0-0"]').should('have.class', 'absent');
    cy.get('[data-id="tile-0-1"]').should('have.class', 'absent');
    cy.get('[data-id="tile-0-2"]').should('have.class', 'absent');
    cy.get('[data-id="tile-0-3"]').should('have.class', 'absent');
    cy.get('[data-id="tile-0-4"]').should('have.class', 'absent');

    cy.get('[data-key="C"]').should('have.class', 'absent');
    cy.get('[data-key="O"]').should('have.class', 'absent');
    cy.get('[data-key="L"]').should('have.class', 'absent');
    cy.get('[data-key="D"]').should('have.class', 'absent');
    cy.get('[data-key="S"]').should('have.class', 'absent');
  });

  it('present letters show up', () => {
    cy.get('[data-id="custom-word-btn"]').click();
    cy.get('[data-id="word-input"]').type('baker{enter}');
    cy.get('body').type('{c}{o}{o}{k}{s}{enter}');
    cy.get('[data-id="tile-0-0"]').should('have.class', 'absent');
    cy.get('[data-id="tile-0-1"]').should('have.class', 'absent');
    cy.get('[data-id="tile-0-2"]').should('have.class', 'absent');
    cy.get('[data-id="tile-0-3"]').should('have.class', 'present');
    cy.get('[data-id="tile-0-4"]').should('have.class', 'absent');

    cy.get('[data-key="C"]').should('have.class', 'absent');
    cy.get('[data-key="O"]').should('have.class', 'absent');
    cy.get('[data-key="K"]').should('have.class', 'present');
    cy.get('[data-key="S"]').should('have.class', 'absent');
  });

  it('correct letters show up', () => {
    cy.get('[data-id="custom-word-btn"]').click();
    cy.get('[data-id="word-input"]').type('baker{enter}');
    cy.get('body').type('{b}{o}{o}{k}{s}{enter}');
    cy.get('[data-id="tile-0-0"]').should('have.class', 'correct');
    cy.get('[data-id="tile-0-1"]').should('have.class', 'absent');
    cy.get('[data-id="tile-0-2"]').should('have.class', 'absent');
    cy.get('[data-id="tile-0-3"]').should('have.class', 'present');
    cy.get('[data-id="tile-0-4"]').should('have.class', 'absent');

    cy.get('[data-key="B"]').should('have.class', 'correct');
    cy.get('[data-key="O"]').should('have.class', 'absent');
    cy.get('[data-key="O"]').should('have.class', 'absent');
    cy.get('[data-key="K"]').should('have.class', 'present');
    cy.get('[data-key="S"]').should('have.class', 'absent');
  });

  it('double present letters show up', () => {
    cy.get('[data-id="custom-word-btn"]').click();
    cy.get('[data-id="word-input"]').type('books{enter}');
    cy.get('body').type('{i}{g}{l}{o}{o}{enter}');
    cy.get('[data-id="tile-0-0"]').should('have.class', 'absent');
    cy.get('[data-id="tile-0-1"]').should('have.class', 'absent');
    cy.get('[data-id="tile-0-2"]').should('have.class', 'absent');
    cy.get('[data-id="tile-0-3"]').should('have.class', 'present');
    cy.get('[data-id="tile-0-4"]').should('have.class', 'present');

    cy.get('[data-key="I"]').should('have.class', 'absent');
    cy.get('[data-key="G"]').should('have.class', 'absent');
    cy.get('[data-key="L"]').should('have.class', 'absent');
    cy.get('[data-key="O"]').should('have.class', 'present');
  });

  it('double correct letters show up', () => {
    cy.get('[data-id="custom-word-btn"]').click();
    cy.get('[data-id="word-input"]').type('books{enter}');
    cy.get('body').type('{c}{o}{o}{l}{s}{enter}');
    cy.get('[data-id="tile-0-0"]').should('have.class', 'absent');
    cy.get('[data-id="tile-0-1"]').should('have.class', 'correct');
    cy.get('[data-id="tile-0-2"]').should('have.class', 'correct');
    cy.get('[data-id="tile-0-3"]').should('have.class', 'absent');
    cy.get('[data-id="tile-0-4"]').should('have.class', 'correct');

    cy.get('[data-key="C"]').should('have.class', 'absent');
    cy.get('[data-key="O"]').should('have.class', 'correct');
    cy.get('[data-key="L"]').should('have.class', 'absent');
    cy.get('[data-key="S"]').should('have.class', 'correct');
  });

  it('correct/present tiles accumulate on next row', () => {
    cy.get('[data-id="custom-word-btn"]').click();
    cy.get('[data-id="word-input"]').type('baker{enter}');
    cy.get('body').type('{b}{o}{o}{k}{s}{enter}');
    cy.get('body').type('{b}{a}{r}{k}{s}{enter}');
    cy.get('[data-id="tile-1-0"]').should('have.class', 'correct');
    cy.get('[data-id="tile-1-1"]').should('have.class', 'correct');
    cy.get('[data-id="tile-1-2"]').should('have.class', 'present');
    cy.get('[data-id="tile-1-3"]').should('have.class', 'present');
    cy.get('[data-id="tile-1-4"]').should('have.class', 'absent');

    cy.get('[data-key="O"]').should('have.class', 'absent');
    cy.get('[data-key="B"]').should('have.class', 'correct');
    cy.get('[data-key="A"]').should('have.class', 'correct');
    cy.get('[data-key="R"]').should('have.class', 'present');
    cy.get('[data-key="K"]').should('have.class', 'present');
    cy.get('[data-key="S"]').should('have.class', 'absent');

    cy.get('body').type('{b}{a}{k}{e}{s}{enter}');
    cy.get('[data-id="tile-2-0"]').should('have.class', 'correct');
    cy.get('[data-id="tile-2-1"]').should('have.class', 'correct');
    cy.get('[data-id="tile-2-2"]').should('have.class', 'correct');
    cy.get('[data-id="tile-2-3"]').should('have.class', 'correct');
    cy.get('[data-id="tile-2-4"]').should('have.class', 'absent');

    cy.get('[data-key="O"]').should('have.class', 'absent');
    cy.get('[data-key="B"]').should('have.class', 'correct');
    cy.get('[data-key="A"]').should('have.class', 'correct');
    cy.get('[data-key="R"]').should('have.class', 'present');
    cy.get('[data-key="K"]').should('have.class', 'correct');
    cy.get('[data-key="E"]').should('have.class', 'correct');
    cy.get('[data-key="S"]').should('have.class', 'absent');

    cy.get('body').type('{b}{a}{k}{e}{r}{enter}');

    cy.get('[data-key="O"]').should('have.class', 'absent');
    cy.get('[data-key="B"]').should('have.class', 'correct');
    cy.get('[data-key="A"]').should('have.class', 'correct');
    cy.get('[data-key="R"]').should('have.class', 'correct');
    cy.get('[data-key="K"]').should('have.class', 'correct');
    cy.get('[data-key="E"]').should('have.class', 'correct');
    cy.get('[data-key="S"]').should('have.class', 'absent');
  });
});
