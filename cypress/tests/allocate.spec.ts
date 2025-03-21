interface todo {
    userId: number;
    id: number;
    title: string;
    completed: boolean;
}

describe('allocate interview tests', () => {
    beforeEach(() => {
        indexedDB.deleteDatabase('firebaseLocalStorageDb');
    })

    it('Invalid login attempt', () => {
        cy.visit('/')
        cy.intercept('POST', '**/verifyPassword*').as('pwCheck');
        cy.get('input#password').type('invalid_pw');
        cy.get('#sign-in-button-manual').click();
        cy.wait('@pwCheck')
            .its('response')
            .then((resp) => {
                expect(resp.statusCode).to.eq(400);
                expect(resp.body.error.message).to.eq('INVALID_PASSWORD');
            })
    })
    
    context('Successful login tests', () => {
        beforeEach(() => {
            cy.intercept('GET', '**/todos').as('todos');
            cy.login();
        })

        it('Create a todo then check all items and submit', () => {
            // Check all default todos
            cy.wait('@todos')
                .its('response.body')
                .then((body: todo[]) => {
                    // There is another non-obvious filter on the page
                    // the below filter returns 9 but there is always only 5 on the page.
                    // This is an instance where I would look at the code then reach out to a dev to better
                    // understand business logic
                    return body.filter(o => o.userId === 1 && !o.completed).length
                })
                .then((n: number) => {
                    cy.contains('A Simple Todo List').should('be.visible');
                    cy.get('input[type="checkbox"]')
                        .should('have.length', 5) // eventually replace 5 with n
                        .each(($el) => {
                            // Have to force check since the input is covered by a div
                            cy.wrap($el).check({ force: true });
                        })
                })

            // Create a new todo and check it
            const myTodo = 'create a todo';
            cy.get('input[type="text"]').type(myTodo + '{enter}');
            cy.get('input[type="checkbox"]')
                .last()
                .should('not.be.checked')
                .as('myTodo')
                .siblings('label')
                .should('have.text', myTodo);

            cy.get('@myTodo').check({ force: true });
            cy.get('@myTodo').should('be.checked');
            
            cy.contains('button', /submit/i).click();
            cy.location('pathname').should('eq', '/success');
            cy.get('h1').should('contain.text', 'Success!')
        })

        it('Confirm inability to submit without checking all todos', () => {
            // Will spy on console.log to see what is returned from the app
            cy.window()
                .its('console')
                .then((console) => {
                    cy.spy(console, 'log').as('log');
                })
            // Loop through all checkboxes and confirm failed submission after each attempt
            cy.get('input[type="checkbox"]')
                .should('have.length', 5)
                .each(($el, i, $elArr) => {
                    // Click the submit button and confirm state
                    cy.contains('button', /submit/i).click();
                    // Get last call to console.log and verify what is printed
                    // we can't use should('have.returned') because console.log returns void
                    cy.get<Console>('@log')
                        .invoke('getCalls')
                        .then((calls: any[]) => calls[calls.length - 1])
                        .should('have.a.property', 'lastArg', `unchecked: ${$elArr.length - i}`);
                    cy.get('.error').should('be.visible');
                    // Check off a todo prior to next iteration
                    cy.wrap($el)
                        .should('not.be.checked')
                        .check({ force: true });
                    cy.wrap($el).should('be.checked');
                })
        })
    })
        
})