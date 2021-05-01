/// <reference types="Cypress" />

context('Sign In', () => {
    beforeEach(() => {
      cy.goto('signin')
    });


    it('View - Sign In With Wrong Email', () => {
      cy.signin('unknown');
      cy.get('#mat-error-2').should('be.exist');
    });

  it('View - Sign In', () => {
    cy.signin('user');
    cy.get('button').contains('Sign Up').should('not.exist');
  });

});
