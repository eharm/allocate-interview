declare namespace Cypress {
    interface Chainable {
        /**
         * This will log in to the application using the default credentials. You can also override and pass in 
         * another username and password if needed.
         * @param username username to log in with. This is already set and is defaulted to Cypress.env('username')
         * @param password password to log in with. This is defaulted to Cypress.env('password')
         */
        login(username?: string, password?: string): Cypress.Chainable<null>
    }
}