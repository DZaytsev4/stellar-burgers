describe('Страница конструктора бургера', () => {
  const testUrl = 'http://localhost:4000';
  const modalSelector = '[data-cy="modal"]';

  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');
    cy.intercept('GET', 'api/auth/user', {
      fixture: 'user.json'
    });
    cy.intercept('POST', 'api/orders', {
      fixture: 'order.json'
    }).as('postOrder');

    window.localStorage.setItem(
      'refreshToken',
      JSON.stringify('test-refreshToken')
    );
    cy.setCookie('accessToken', 'test-accessToken');
    cy.viewport(1300, 800);
    cy.visit(testUrl);
  });

  afterEach(function () {
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  it('Наличие прелоадера во время загрузки ингредиентов', () => {
    cy.visit(testUrl);
    cy.wait('@getIngredients');
    cy.get('main').should('contain', 'Соберите бургер');
    cy.get('h1').should('contain', 'Соберите бургер');
  });

  it('Ошибка при неудачном получении ингредиентов', () => {
    cy.visit(testUrl);
    cy.wait('@getIngredients');
  });

  it('Добавление ингредиентов из списка в конструктор', () => {
    cy.visit(testUrl);
    cy.wait('@getIngredients');
    // Добавление булок
    cy.get('[data-ing="ingredient-item-bun"]').contains('Добавить').click();
    cy.get('[data-cy="constructor-bun-1"]').should('exist');
    cy.get('[data-cy="constructor-bun-2"]').should('exist');

    // Добавление других ингредиентов
    cy.get('[data-ing="ingredient-item-main"]')
      .contains('Добавить')
      .click({ force: true });
    cy.get('[data-cy="constructor-topping"]').should('exist');

    cy.get('[data-ing="ingredient-item-sauce"]').contains('Добавить').click();
    cy.get('[data-cy="constructor-topping"]').should('exist');
  });

  it('Открытие и закрытие модального окна ингредиента', () => {
    cy.visit(testUrl);
    cy.wait('@getIngredients');

    //открытие
    cy.get('[data-cy="ingredient-item-1"]').click();
    cy.get(modalSelector).should('be.visible');

    // закрытие по клику на крестик
    cy.get('[data-cy="modal-close-btn"]').click();
    cy.get(modalSelector).should('not.exist');
  });

  it('Открытие и закрытие модального окна ингредиента по клику на оверлей', () => {
    cy.visit(testUrl);
    cy.wait('@getIngredients');

    //открытие
    cy.get('[data-cy="ingredient-item-2"]').click();
    cy.get(modalSelector).should('be.visible');

    // Закрытие по клику на оверлей
    cy.get('[data-cy="modal-overlay"]').click('topRight', { force: true });
    cy.get(modalSelector).should('not.exist');
  });

  it('Создание заказа', () => {
    cy.visit(testUrl);
    cy.wait('@getIngredients');
    cy.get('[data-ing="ingredient-item-bun"]').contains('Добавить').click();
    cy.get('[data-ing="ingredient-item-main"]').contains('Добавить').click();
    cy.get('[data-ing="ingredient-item-sauce"]').contains('Добавить').click();

    //Вызывается клик по кнопке «Оформить заказ».
    cy.get('[data-cy=order-summ] button').click();

    //Проверяется, что модальное окно открылось и номер заказа верный.
    cy.get(modalSelector).contains('45567').should('exist');

    //Закрывается модальное окно и проверяется успешность закрытия.
    cy.get('[data-cy="modal-close-btn"]').click();
    cy.get(modalSelector).should('not.exist');

    //Проверяется, что конструктор пуст.
    cy.get('[data-cy=constructor]')
      .contains('Ингредиент 1')
      .should('not.exist');
    cy.get('[data-cy=constructor]')
      .contains('Ингредиент 3')
      .should('not.exist');
    cy.get('[data-cy=constructor]')
      .contains('Ингредиент 4')
      .should('not.exist');
  });
});
