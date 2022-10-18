describe('Test happy flow login', () => {
  it('has a H1 title containing Welkom', () => {
    cy.visit('http://localhost:3000/login')
    cy.get('h1').contains('Welkom')
  })
  it('does not have a nav login button', () => {
    cy.get('[data-cy="nav-login"]').should('not.exist')
  })
  it('does not have a user menu', () => {
    cy.get('[data-cy="usermenu-button"]').should('not.exist')
  })
  it('has an email field', () => {
    cy.get('[data-cy="email"]')
  })
  it('is focused on the email field', () => {
    cy.focused().should('have.attr', 'type').and('include', 'email')
  })
  it('has a password field', () => {
    cy.get('[data-cy="password"]')
  })
  it('has a button to log in', () => {
    cy.get('[data-cy="submit"]').contains('Log in')
  })
  it('has a link to the forgot password page', () => {
    cy.get('[data-cy="forgot password link"]').should('have.attr', 'href').and('include', '/forgotpassword')
  })
  it('can login', () => {
    cy.get('[data-cy="email"]').type(Cypress.env('TEST_EMAIL'))
    cy.get('[data-cy="password"]').type(Cypress.env('TEST_PASSWORD'))
    cy.get('[data-cy="submit"]').click()
  })
  it('has a user menu and can log out', () => {
    cy.get('[data-cy="usermenu-button"]').click()
    cy.get('[data-cy="usermenu-logout"]').click()
  })
  it('does not have a user menu', () => {
    cy.get('[data-cy="usermenu-button"]').should('not.exist')
  })
  it('redirects to page from url', () => {
    cy.visit(`http://localhost:3000/login?redirectTo=${encodeURI('/groups')}`)
    cy.get('[data-cy="email"]').type(Cypress.env('TEST_EMAIL'))
    cy.get('[data-cy="password"]').type(Cypress.env('TEST_PASSWORD'))
    cy.get('[data-cy="submit"]').click()
    cy.get('[data-cy="groups-title"]')
  })
})

describe('Test error states', () => {
  it('asks for required fields', () => {
    cy.visit(`http://localhost:3000/login`)
    cy.get('[data-cy="submit"]').click()
    cy.get('[data-cy="email"]').find('input').should('have.attr', 'aria-invalid').and('equal', 'true')
  })
  it('throws error on wrong credentials', () => {
    cy.get('[data-cy="email"]').type(Cypress.env('TEST_EMAIL'))
    cy.get('[data-cy="password"]').type('Wrong password')
    cy.get('[data-cy="submit"]').click()
    cy.get('[data-cy="password"]').find('input').should('have.attr', 'aria-invalid').and('equal', 'true')
  })
})