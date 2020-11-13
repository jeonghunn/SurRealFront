Cypress.Commands.add('goto', (url) => {
  cy.visit("http://localhost:4200/" + url, {
    timeout: 15000,
    onBeforeLoad: (_contentWindow) => {
      Object.defineProperty(_contentWindow.navigator, 'language', {value: 'en-US'})
    }
  });
});
