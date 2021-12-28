Cypress.Commands.add('goto', (url) => {
  cy.server();
  cy.route('GET', '**/en.json').as('getLangFile');

  cy.visit("http://localhost:4200/" + url, {
    timeout: 15000,
    onBeforeLoad: (_contentWindow) => {
      Object.defineProperty(_contentWindow.navigator, 'language', {value: 'en-US'})
    }
  });

  cy.wait('@getLangFile');

});

Cypress.Commands.add('signin', (user) => {
  let id = 'admin@admin.com';
  const password  = '12345678';

  switch (user) {
    case 'user':
      id = 'test@test.com';
      break;
    case 'unknown':
      id = 'unknown@unknown.com';
      break;
    default:
      id = 'admin@admin.com';
  }

  if (user === 'user') {
    id = 'test@test.com';
  }

  cy.server();
  cy.route('POST', '**/signin').as('getSignIn');
  cy.goto('/signin');
  cy.get('#mat-input-0', {timeout: 10000})
    .type(id).should('have.value', id);
  cy.get('#mat-input-1')
    .type(password).should('have.value',password);
  cy.get('.submit').click();
  cy.wait('@getSignIn');

});
