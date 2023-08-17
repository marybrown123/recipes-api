import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateRecipeCommand } from '../../../recipe/commands/impl/createRecipe.command';
import { RecipeDAO } from '../../../recipe/recipe.dao';
import { EventGateway } from '../../../websocket/event.gateway';
import { RecipeResponse } from 'src/recipe/responses/recipe.response';
import { FileService } from 'src/file/file.service';
import { S3Service } from 'src/file/s3.service';

@CommandHandler(CreateRecipeCommand)
export class CreateRecipeHandler
  implements ICommandHandler<CreateRecipeCommand>
{
  constructor(
    private recipeDAO: RecipeDAO,
    private eventGateway: EventGateway,
    private fileService: FileService,
    private s3Service: S3Service,
  ) {}
  async execute(command: CreateRecipeCommand) {
    const { recipe, authorId } = command;
    const recipeFromDb = await this.recipeDAO.createRecipe(recipe, authorId);

    if (recipeFromDb) {
      this.eventGateway.createRecipeEvent(authorId);
    }

    const file = await this.fileService.findFileById(recipeFromDb.fileId);
    const fileUrl = await this.s3Service.generatePresignedUrl(file.key);

    return new RecipeResponse(recipeFromDb, fileUrl);
  }
}
