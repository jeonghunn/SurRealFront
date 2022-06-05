/// <reference types="Cypress" />

context('Navigation Bar Component', () => {
    beforeEach(() => {
      cy.goto('intro')
    });


    it('Sign out', () => {
      cy.signin('user');
      cy.get('app-navbar').find('.mat-focus-indicator > .mat-button-wrapper > .mat-icon').last().click();
      cy.get('.mat-menu-content').contains('Sign Out').click();
      cy.get('app-navbar').find('button').contains('Sign');
    });


  it('Sign out on Profile page', () => {
    cy.signin('user');
    cy.get('app-navbar').find('.mat-focus-indicator > .mat-button-wrapper > .mat-icon').last().click();
    cy.get('.mat-menu-content').contains('My Profile', {timeout: 8000}).click();
    cy.get('app-navbar').find('.mat-focus-indicator > .mat-button-wrapper > .mat-icon').last().click();
    cy.get('.mat-menu-content').contains('Sign Out', {timeout: 8000}).click();
    cy.get('app-navbar').find('button').contains('Sign');
  });


});
