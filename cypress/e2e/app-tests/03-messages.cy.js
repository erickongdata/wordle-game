/// <reference types="cypress" />

describe('Win and lose messages', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/');
    cy.intercept('https://api.dictionaryapi.dev/api/v2/entries/en/**', {}).as(
      'dictAPI'
    );
    cy.get('[data-id="custom-word-btn"]').click();
    cy.get('[data-id="word-input"]').type('baker{enter}');
  });

  it('win message appears', () => {
    cy.get('body').type('{b}{a}{k}{e}{r}');
    cy.get('[data-id="message"]').should('not.be.visible');
    cy.get('body').type('{enter}');
    cy.get('[data-id="message"]').should('be.visible');
    cy.contains('win', { matchCase: false })
      .should('exist')
      .should('be.visible');
    cy.contains('lost', { matchCase: false }).should('not.exist');
    cy.get('[data-id="message-btn"]')
      .should('be.visible')
      .should('contain.text', 'New game')
      .click();
    cy.log('Pressing new game resets the game');
    cy.get('[data-id="tile-0-0"]')
      .should('have.text', '')
      .should('not.have.class', 'correct');
    cy.get('[data-id="tile-0-1"]')
      .should('have.text', '')
      .should('not.have.class', 'correct');
    cy.get('[data-id="tile-0-2"]')
      .should('have.text', '')
      .should('not.have.class', 'correct');
    cy.get('[data-id="tile-0-3"]')
      .should('have.text', '')
      .should('not.have.class', 'correct');
    cy.get('[data-id="tile-0-4"]')
      .should('have.text', '')
      .should('not.have.class', 'correct');

    cy.get('[data-key="B"]').should('not.have.class', 'correct');
    cy.get('[data-key="A"]').should('not.have.class', 'correct');
    cy.get('[data-key="K"]').should('not.have.class', 'correct');
    cy.get('[data-key="E"]').should('not.have.class', 'correct');
    cy.get('[data-key="R"]').should('not.have.class', 'correct');
  });

  it('lose message appears on quit', () => {
    cy.get('body').type('{b}{o}{o}{k}{s}{enter}');
    cy.get('body').type('{b}{o}');
    cy.get('[data-id="message"]').should('not.be.visible');
    cy.get('[data-id="quit-btn"]').click();
    cy.get('[data-id="message"]').should('be.visible');
    cy.contains('lost', { matchCase: false }).should('exist');
    cy.contains('baker', { matchCase: false }).should('exist');
    cy.get('[data-id="message-btn"]')
      .should('be.visible')
      .should('contain.text', 'New game')
      .click();

    cy.log('Pressing new game resets the game');
    cy.get('[data-id="tile-0-0"]')
      .should('have.text', '')
      .should('not.have.class', 'correct');
    cy.get('[data-id="tile-0-1"]')
      .should('have.text', '')
      .should('not.have.class', 'correct');
    cy.get('[data-id="tile-0-2"]')
      .should('have.text', '')
      .should('not.have.class', 'correct');
    cy.get('[data-id="tile-0-3"]')
      .should('have.text', '')
      .should('not.have.class', 'correct');
    cy.get('[data-id="tile-0-4"]')
      .should('have.text', '')
      .should('not.have.class', 'correct');

    cy.get('[data-key="B"]').should('not.have.class', 'correct');
    cy.get('[data-key="O"]').should('not.have.class', 'absent');
    cy.get('[data-key="K"]').should('not.have.class', 'present');
    cy.get('[data-key="S"]').should('not.have.class', 'absent');
  });

  it('running out of guesses loses', () => {
    cy.get('body')
      .type('{t}{r}{i}{e}{s}{enter}')
      .type('{t}{r}{i}{e}{s}{enter}')
      .type('{t}{r}{i}{e}{s}{enter}')
      .type('{t}{r}{i}{e}{s}{enter}')
      .type('{t}{r}{i}{e}{s}{enter}')
      .type('{t}{r}{i}{e}{s}');
    cy.get('[data-id="message"]').should('not.be.visible');
    cy.get('body').type('{enter}');
    cy.get('[data-id="message"]').should('be.visible');
    cy.contains('lost', { matchCase: false }).should('exist');
  });
});

describe('checking word and word not valid messages appear', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/');
    cy.intercept(
      'https://api.dictionaryapi.dev/api/v2/entries/en/**',
      (req) => {
        req.reply({
          statusCode: 404,
          delay: 2000, // milliseconds
          throttleKbps: 1000, // to simulate a 3G connection
          forceNetworkError: false, // default
        });
      }
    ).as('dictAPI');
  });

  it('word checking and not valid message appears in custom word input', () => {
    cy.get('[data-id="custom-word-btn"]').click();
    cy.get('[data-id="message"]').should('not.be.visible');
    cy.get('[data-id="word-input"]').type('zzzzz{enter}');
    cy.get('[data-id="message"]').should('be.visible');
    cy.contains('checking word', { matchCase: false }).should('exist');
    cy.contains('word not valid', { matchCase: false }).should('exist');
  });

  it('word checking and not valid message appears in normal input', () => {
    cy.get('body').type('{z}{z}{z}{z}{z}');
    cy.get('[data-id="message"]').should('not.be.visible');
    cy.get('body').type('{enter}');
    cy.get('[data-id="message"]').should('be.visible');
    cy.contains('checking word', { matchCase: false }).should('exist');
    cy.contains('word not valid', { matchCase: false }).should('exist');
  });
});
