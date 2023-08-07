export class UploadRecipeImageCommand {
  constructor(
    public readonly recipeId: number,
    public readonly file: Express.Multer.File,
  ) {}
}
