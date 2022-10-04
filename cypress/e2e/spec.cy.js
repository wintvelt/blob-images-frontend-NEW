describe('Test the page', () => {
  it('Has a H1 title containing', () => {
    cy.visit('http://localhost:3000/')
    cy.get('h1').contains('example')
  })
  it('has a link to the about page', () => {
    cy.get('a').should('have.attr', 'href').and('include', '/about')
  })
})