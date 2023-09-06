-- CreateTable
CREATE TABLE "company" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "description" VARCHAR(255),
    "name" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" UUID NOT NULL,
    "tenant_id" VARCHAR(255) NOT NULL,

    CONSTRAINT "company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "delivery_item" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(255) NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" INTEGER,
    "weight" INTEGER,
    "deadline" TIMESTAMP(6),
    "delivery_note_id" UUID NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "delivery_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "delivery_note" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "note_number" VARCHAR(255) NOT NULL,
    "issuer" VARCHAR(255) NOT NULL,
    "addressee" VARCHAR(255) NOT NULL,
    "company_id" UUID NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "delivery_note_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "excel_import" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "file_name" VARCHAR(255) NOT NULL,
    "imported_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "item_limit" INTEGER,
    "delivery_note_id" UUID NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "excel_import_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invalid_note" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "invalidated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reason" VARCHAR(255),
    "delivery_note_id" UUID NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "invalid_note_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" VARCHAR(255) NOT NULL,
    "firstName" VARCHAR(255),
    "lastName" VARCHAR(255),
    "roq_user_id" VARCHAR(255) NOT NULL,
    "tenant_id" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- AddForeignKey
ALTER TABLE "company" ADD CONSTRAINT "company_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "delivery_item" ADD CONSTRAINT "delivery_item_delivery_note_id_fkey" FOREIGN KEY ("delivery_note_id") REFERENCES "delivery_note"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "delivery_note" ADD CONSTRAINT "delivery_note_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "excel_import" ADD CONSTRAINT "excel_import_delivery_note_id_fkey" FOREIGN KEY ("delivery_note_id") REFERENCES "delivery_note"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "invalid_note" ADD CONSTRAINT "invalid_note_delivery_note_id_fkey" FOREIGN KEY ("delivery_note_id") REFERENCES "delivery_note"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

