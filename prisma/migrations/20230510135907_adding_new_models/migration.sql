-- CreateTable
CREATE TABLE "recipe_preparation_steps" (
    "id" SERIAL NOT NULL,
    "step" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "recipe_idcd" INTEGER NOT NULL,

    CONSTRAINT "recipe_preparation_steps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recipe_ingredients" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "recipe_id" INTEGER NOT NULL,

    CONSTRAINT "recipe_ingredients_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "recipe_preparation_steps" ADD CONSTRAINT "recipe_preparation_steps_recipe_idcd_fkey" FOREIGN KEY ("recipe_idcd") REFERENCES "recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipe_ingredients" ADD CONSTRAINT "recipe_ingredients_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
