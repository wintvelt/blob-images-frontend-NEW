describe('Test invite when not logged in', () => {
  it('has a H1 title', () => {
    cy.visit(`http://localhost:3000/invites/${Cypress.env('TEST_INVITE')}`)
    cy.get('h1')
  })
  it('has a nav-login button', () => {
    cy.get('[data-cy="nav-login"]')
  })
  it('is addressed to invitee', () => {
    cy.get('[data-cy="intro1"]').should('include.text', Cypress.env('TEST_INVITEENAME'))
    cy.get('[data-cy="intro2"]').should('not.include.text', Cypress.env('TEST_INVITEENAME'))
  })
  it('does not have addressed-to-other-email warning', () => {
    cy.get('[data-cy="other"]').should('not.exist')
  })
})

describe('Test invite logging in and out', () => {
  it('shows user as addressee after logging in', () => {
    cy.visit(`http://localhost:3000/invites/${Cypress.env('TEST_INVITE')}`)
    cy.get('[data-cy="nav-login"]').click()
    cy.get('[data-cy="email"]').type(Cypress.env('TEST_EMAIL'))
    cy.get('[data-cy="password"]').type(Cypress.env('TEST_PASSWORD'))
    cy.get('[data-cy="submit"]').click()
    cy.get('[data-cy="logged in"]').should('be.visible')
    cy.visit(`http://localhost:3000/invites/${Cypress.env('TEST_INVITE')}`)

    cy.get('[data-cy="intro1"]').should('include.text', Cypress.env('TEST_USERNAME'))
    cy.get('[data-cy="intro2"]').should('include.text', Cypress.env('TEST_INVITEENAME'))
  })
  it('includes disclaimer text that invite is addressed to other email', () => {
    cy.get('[data-cy="other').should('exist')
  })
  it('reloads page on logout', () => {
    cy.get('[data-cy="usermenu-button"]').click()
    cy.get('[data-cy="usermenu-logout"]').click()
    cy.get('[data-cy="other"]').should('not.exist')
  })
})

describe('Test invite for someone else', () => {
  it('shows error message with login link when not logged in', () => {
    cy.visit(`http://localhost:3000/invites/${Cypress.env('TEST_INVITE_OTHER')}`)
    cy.get('h1').should('include.text', 'Uitnodiging is voor een lid')
    cy.get('[data-cy="errorlink"]').should('include.text', 'Log in')
  })
  it('shows error message when logged in', () => {
    cy.visit(`http://localhost:3000/login`)
    cy.get('[data-cy="email"]').type(Cypress.env('TEST_EMAIL'))
    cy.get('[data-cy="password"]').type(Cypress.env('TEST_PASSWORD'))
    cy.get('[data-cy="submit"]').click()
    cy.get('[data-cy="logged in"]').should('be.visible')
    cy.visit(`http://localhost:3000/invites/${Cypress.env('TEST_INVITE_OTHER')}`)

    cy.get('h1').should('include.text', 'Uitnodiging is niet voor jou')
    cy.get('[data-cy="errorlink"]').should('not.exist')
  })
})

describe('Test accepted invite', () => {
  it('shows error message with login link when not logged in', () => {
    cy.visit(`http://localhost:3000/invites/${Cypress.env('TEST_INVITE_ACCEPTED')}`)
    cy.get('h1').should('include.text', 'Uitnodiging is voor een lid')
    cy.get('[data-cy="errorlink"]').should('include.text', 'Log in')
  })
  it('shows error message when logged in', () => {
    cy.visit(`http://localhost:3000/login`)
    cy.get('[data-cy="email"]').type(Cypress.env('TEST_EMAIL'))
    cy.get('[data-cy="password"]').type(Cypress.env('TEST_PASSWORD'))
    cy.get('[data-cy="submit"]').click()
    cy.get('[data-cy="logged in"]').should('be.visible')

    cy.visit(`http://localhost:3000/invites/${Cypress.env('TEST_INVITE_ACCEPTED')}`)

    cy.get('h1').should('include.text', 'Uitnodiging al geaccepteerd')
    cy.get('[data-cy="errorlink"]').should('include.text','groep')
  })
})

describe('Test expired invite', () => {
  it('shows error message that invite has expired', () => {
    cy.visit(`http://localhost:3000/invites/${Cypress.env('TEST_INVITE_EXPIRED')}`)

    cy.get('h1').should('include.text', 'verlopen')
    cy.get('[data-cy="errorlink"]').should('not.exist')
  })
})

describe('Test decline and accept invite', () => {
  beforeEach(() => {
    cy.visit(`http://localhost:3000/login`)
    cy.get('[data-cy="email"]').type(Cypress.env('TEST_EMAIL2'))
    cy.get('[data-cy="password"]').type(Cypress.env('TEST_PASSWORD'))
    cy.get('[data-cy="submit"]').click()
    cy.get('[data-cy="logged in"]').should('be.visible')
    // TODO: invite wintvelt@xs4all before each test
  })

  it('is possible to accept the invite', () => {
    cy.visit(`http://localhost:3000/invites/${Cypress.env('TEST_INVITE2')}`)
    cy.get('h1').should('not.be.visible')
    // TODO: accept the invite
    // TODO: cleanup afterwards (leave the group)
  })
  it('is possible to decline the invite', () => {
    cy.visit(`http://localhost:3000/invites/${Cypress.env('TEST_INVITE2')}`)
    cy.get('h1').should('not.be.visible')
    // TODO: decline the invite
  })
})