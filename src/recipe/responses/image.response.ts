import { Image } from '@prisma/client';

export class ImageResponse implements Image {
  constructor(image: Image) {
    this.id = image.id;
    this.name = image.name;
    this.key = image.key;
    this.recipeId = image.recipeId;
  }
  id: number;
  name: string;
  key: string;
  recipeId: number;
}
