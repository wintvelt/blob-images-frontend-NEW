/* 
    prerequisites for these tests
    - admin user of a group named "Testgroep"
    - another registered user, not member of the group
    - an email address, not registered as user

    NB: all 3 users will receive various emails as part of this test
*/

describe('Test send invites', () => {
    // - log in as admin and navigate to group, to invite members
    // - invite registered user + email address to the group
    it('Log in as admin and invite 2 new members', () => {
        cy.visit(`http://localhost:3000`)
        cy.get('[data-cy="nav-login"]').click()
        cy.get('[data-cy="email"]').type(Cypress.env('ADMIN_USER'))
        cy.get('[data-cy="password"]').type(Cypress.env('PASSWORD'))
        cy.get('[data-cy="submit"]').click()
        cy.get('[data-cy="logged in"]').should('be.visible')

        cy.visit(`http://localhost:3000/groups/${Cypress.env('TEST_GROUPID')}/members/invite`)
        cy.get('[data-cy="inviteeName"]').type('Reg user')
        cy.get('[data-cy="inviteeEmail"]').type(Cypress.env('REG_USER'))
        cy.get('[data-cy="inviteMore"]').click()
        cy.get('[data-cy="invitees.0.name"]').type('Email user')
        cy.get('[data-cy="invitees.0.email"]').type(Cypress.env('EMAIL_USER'))
        cy.get('[data-cy="message"] textarea:first')
            .type('Hoi vriend,\nwil jij ook lid worden?\n\nGroeten\nVaatje')

        cy.get('[data-cy="submit"]').click()
        cy.get('[data-cy="success"]').should('be.visible')
    })
})

describe('Shows error messages', () => {
    // - navigate to invite for reg user
    // - shows error message - is for reg user
    it('shows error message to unauth user retrieving invite for reg user', () => {
        cy.visit(`http://localhost:3000/invites/${Cypress.env('REG_INVITE')}`)
        cy.get('[data-cy="invite not for you"').should('include.text', 'voor een lid')
    })
    // - log in as admin user
    // - navigate to invite for reg user
    // - shows error message - is for other user
    it('shows error message to auth user retrieving invite for other user', () => {
        cy.visit(`http://localhost:3000`)
        cy.get('[data-cy="nav-login"]').click()
        cy.get('[data-cy="email"]').type(Cypress.env('ADMIN_USER'))
        cy.get('[data-cy="password"]').type(Cypress.env('PASSWORD'))
        cy.get('[data-cy="submit"]').click()
        cy.get('[data-cy="logged in"]').should('be.visible')

        cy.visit(`http://localhost:3000/invites/${Cypress.env('REG_INVITE')}`)
        cy.get('[data-cy="invite not for you"').should('include.text', 'niet voor jou')
    })
})

describe('Test reg user accept invite and leave group', () => {
    beforeEach(() => {
        // - log in as reg user
        cy.visit(`http://localhost:3000`)
        cy.get('[data-cy="nav-login"]').click()
        cy.get('[data-cy="email"]').type(Cypress.env('REG_USER'))
        cy.get('[data-cy="password"]').type(Cypress.env('PASSWORD'))
        cy.get('[data-cy="submit"]').click()
        cy.get('[data-cy="logged in"]').should('be.visible')
    })
    it('allows reg user to join the group', () => {
        // - navigate to invite for reg user
        // - accept invite
        // - navigate to group/members
        // - shows reg user as group member
        cy.visit(`http://localhost:3000/invites/${Cypress.env('REG_INVITE')}`)
        cy.get('[data-cy="accept"]').click()
        cy.get('[data-cy="accepted"]').should('be.visible')
    })
    it('shows error when revisiting accepted invite', () => {
        // - revisit invite page
        // - should show error
        cy.visit(`http://localhost:3000/invites/${Cypress.env('REG_INVITE')}`)
        cy.get('[data-cy="invite already accepted"]').should('be.visible')
    })
    it('allows leaving the group', () => {
        // - leave group (= cleanup)
        // - redirects to groups
        // - group should not be in group list
        cy.visit(`http://localhost:3000/groups/${Cypress.env('TEST_GROUPID')}/members`)
        cy.get(`[data-cy="${Cypress.env('REG_USER')} menu"]`).click()
        cy.get(`[data-cy="${Cypress.env('REG_USER')} leave"]`).click()
        cy.get(`[data-cy="confirm delete"]`).click()
        cy.url().should('not.include','/members')
        cy.get(`[data-cy="${Cypress.env('TEST_GROUPID')} groupcard"]`).should('not.exist')

    })
})


// - navigate to invite for email user
// - decline
describe('Test new user to accept or decline invite', () => {
    // - navigate to invite for email user
    // - accept
    // - shows signup flow
    it('can start the acceptance process to sign up', () => {
        cy.visit(`http://localhost:3000/invites/${Cypress.env('EMAIL_INVITE')}`)
        cy.get('[data-cy="accept"]').click()
    })
    // - navigate to invite for email user
    // - decline
})