/// <reference types="Cypress" />

context('Sign Up', () => {
    beforeEach(() => {
      cy.goto('signup')
    });


    it('Click password hide button', () => {
      cy.get('mat-icon').contains('visibility').click();
      cy.get('input').eq(1).type("asdf").should('have.value', 'asdf');
    });


});
