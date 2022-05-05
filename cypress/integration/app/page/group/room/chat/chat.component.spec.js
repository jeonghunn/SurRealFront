/// <reference types="Cypress" />

context('Chat Component', () => {
    beforeEach(() => {
      cy.signin('test');
      cy.goto('chat/2');
      cy.get(':nth-child(2) > .item').click();
    });


    it('Type Chat Message', () => {
      const timestamp = new Date().getTime();
      cy.get('#chat_message_input').type(`Hello How are you today${timestamp}{enter}`);
      cy.get('.chat').find('.message').last().find('.chat').find('span').should('have.text', "Hello How are you today" + timestamp)
    });

    it('Type Chat Message - Korean', () => {
      const timestamp = new Date().getTime();
      cy.get('#chat_message_input').type(`안녕하세요 반갑습니다${timestamp}{enter}`);
      cy.get('.chat').find('.message').last().find('.chat').find('span').should('have.text', "안녕하세요 반갑습니다" + timestamp)
    });


});
