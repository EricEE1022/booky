describe('signin / signout flow specification', () => {
  it('cannot navigate to /profile without being logged in', () => {
    cy.visit('/profile').url().should('include', '/signin');
  });

  it('rejects a login attempt by an invalid mern_ecommerce user: !!!', () => {
    cy.visit('/signin')
      .get('input[name="email"]')
      .type('!!!')
      .type('{enter}')
      .url()
      .should('include', '/signin');
  });

  it('successfully authenticates a valid mern_ecommerce user: test-account and logs out', () => {
    //cy.visit("/signin")
    cy.visit('/')
      .get('input[name="email"]')
      .type('test-account')
      .type('{enter}')
      .url()
      .should('include', '/profile')
      .get('nav')
      .contains('Logout')
      .click()
      .url()
      .should('include', '/signin');
  });
});
