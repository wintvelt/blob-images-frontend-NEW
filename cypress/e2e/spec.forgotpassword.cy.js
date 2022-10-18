describe('Test forgot password', () => {
  it('has a H1 title', () => {
    cy.visit('http://localhost:3000/forgotpassword')
    cy.get('h1')
  })
  it('has email field ', () => {
    cy.get('[data-cy="email"]')
  })
  it('has submit button', () => {
    cy.get('[data-cy="submit"]')
  })
  it('has nav-login button', () => {
    cy.get('[data-cy="nav-login"]')
  })
  it('has have-code button', () => {
    cy.get('[data-cy="has code"]').click()
  })
  it('(new state) has code field', () => {
    cy.get('[data-cy="code"]')
  })
  it('(new state) has new-password field', () => {
    cy.get('[data-cy="new-password"]')
  })
})