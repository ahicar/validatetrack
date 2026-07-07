describe('Equipment management', () => {
    it('add a new piece of equipment and sees it in the list', () => {
        cy.visit('http://localhost:5173');

        cy.get('input[placeholder="Name"]').type('Autoclave Unit 3');
        cy.get('input[placeholder="Location"]').type('Sterilizations Room A');
        cy.get('input[type="date"]').eq(0).type('2026-01-15');
        cy.get('input[type="date"]').eq(1).type('2026-12-15');

        cy.contains('button', 'Save').click();

        cy.contains('li', 'Autoclave Unit 3').should('exist');
    });
});