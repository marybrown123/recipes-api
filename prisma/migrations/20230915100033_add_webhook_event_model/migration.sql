-- CreateEnum
CREATE TYPE "WebhookEventStatus" AS ENUM ('Pending', 'Failed', 'Succed');

-- CreateTable
CREATE TABLE "webhook_event" (
    "id" SERIAL NOT NULL,
    "webhook_id" INTEGER NOT NULL,
    "payload" JSONB NOT NULL,
    "status" "WebhookEventStatus" NOT NULL DEFAULT 'Pending',

    CONSTRAINT "webhook_event_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "webhook_event" ADD CONSTRAINT "webhook_event_webhook_id_fkey" FOREIGN KEY ("webhook_id") REFERENCES "webhook"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
