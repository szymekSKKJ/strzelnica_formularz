-- CreateTable
CREATE TABLE "Weapon" (
    "id" TEXT NOT NULL,
    "caliber" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "manufacturer" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "rentalCost" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "Weapon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ammunition" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "caliber" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "pricePerItem" DECIMAL(65,30) NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "Ammunition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ManufacturerOfAmmunition" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ManufacturerOfAmmunition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AmmunitionToManufacturerOfAmmunition" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Weapon_model_key" ON "Weapon"("model");

-- CreateIndex
CREATE UNIQUE INDEX "Ammunition_caliber_key" ON "Ammunition"("caliber");

-- CreateIndex
CREATE UNIQUE INDEX "_AmmunitionToManufacturerOfAmmunition_AB_unique" ON "_AmmunitionToManufacturerOfAmmunition"("A", "B");

-- CreateIndex
CREATE INDEX "_AmmunitionToManufacturerOfAmmunition_B_index" ON "_AmmunitionToManufacturerOfAmmunition"("B");

-- AddForeignKey
ALTER TABLE "Weapon" ADD CONSTRAINT "Weapon_caliber_fkey" FOREIGN KEY ("caliber") REFERENCES "Ammunition"("caliber") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AmmunitionToManufacturerOfAmmunition" ADD CONSTRAINT "_AmmunitionToManufacturerOfAmmunition_A_fkey" FOREIGN KEY ("A") REFERENCES "Ammunition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AmmunitionToManufacturerOfAmmunition" ADD CONSTRAINT "_AmmunitionToManufacturerOfAmmunition_B_fkey" FOREIGN KEY ("B") REFERENCES "ManufacturerOfAmmunition"("id") ON DELETE CASCADE ON UPDATE CASCADE;
