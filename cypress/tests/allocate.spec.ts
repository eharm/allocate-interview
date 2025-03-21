/// types
interface todo {
    userId: number;
    id: number;
    title: string;
    completed: boolean;
}

describe('allocate interview tests', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.intercept('GET', '**/todos').as('todos');
        cy.get('input#password').type('test123');
        cy.get('#sign-in-button-manual').click();
    })

    it('login', () => {
        cy.wait('@todos')
            .its('response.body')
            .then((body: todo[]) => {
                // There is another non-obvious filter on the page
                // the below filter returns 9 but there is always only 5 on the page.
                return body.filter(o => o.userId === 1 && !o.completed).length
            })
            .then((n: number) => {
                cy.contains('A Simple Todo List').should('be.visible');
                cy.get('input[type="checkbox"]')
                    .should('have.length', 5)
                    .each(($el) => {
                        cy.wrap($el).check({ force: true });
                    })
            })
        
        cy.contains('button', /submit/i).click();
        cy.location('pathname').should('eq', '/success');
        cy.get('h1').should('contain.text', 'Success!')
    })

    afterEach(() => {
        indexedDB.deleteDatabase('firebaseLocalStorageDb');
    })
})