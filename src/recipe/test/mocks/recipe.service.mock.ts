export class RecipeServiceMock {
  createRecipe() {
    return {
      id: 1,
      name: 'testName',
      description: 'testDescription',
      imageURL: 'testImageURL',
      preparing: [
        {
          step: 'testStep',
          order: 1,
        },
      ],
      ingredients: [
        {
          name: 'testName',
          amount: 'testAmount',
        },
      ],
    };
  }
}
