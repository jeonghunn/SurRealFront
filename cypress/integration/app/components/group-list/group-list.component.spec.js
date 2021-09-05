/// <reference types="Cypress" />

context('Group List Component', () => {
  beforeEach(() => {
    cy.goto('signin')
  });


  it('View - Sign In and Check List', () => {
    cy.signin('user');
    cy.get('.sidebar').find('.icon').should('be.visible');
  });

});
