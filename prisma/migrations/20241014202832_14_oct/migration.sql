/*
  Warnings:

  - The primary key for the `asistencia` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `empleadoId` on the `asistencia` table. All the data in the column will be lost.
  - You are about to drop the column `entrada` on the `asistencia` table. All the data in the column will be lost.
  - You are about to drop the column `fecha` on the `asistencia` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `asistencia` table. All the data in the column will be lost.
  - You are about to drop the column `salida` on the `asistencia` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[idUsuarioEmpleado,fechaCreacion]` on the table `Asistencia` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fechaCreacion` to the `Asistencia` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fechaHoraEntrada` to the `Asistencia` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idAsistencia` to the `Asistencia` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idUsuarioEmpleado` to the `Asistencia` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `asistencia` DROP FOREIGN KEY `Asistencia_empleadoId_fkey`;

-- DropIndex
DROP INDEX `Asistencia_empleadoId_fecha_key` ON `asistencia`;

-- AlterTable
ALTER TABLE `asistencia` DROP PRIMARY KEY,
    DROP COLUMN `empleadoId`,
    DROP COLUMN `entrada`,
    DROP COLUMN `fecha`,
    DROP COLUMN `id`,
    DROP COLUMN `salida`,
    ADD COLUMN `fechaCreacion` DATETIME(3) NOT NULL,
    ADD COLUMN `fechaHoraEntrada` DATETIME(3) NOT NULL,
    ADD COLUMN `fechaHoraSalida` DATETIME(3) NULL,
    ADD COLUMN `idAsistencia` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `idUsuarioEmpleado` INTEGER NOT NULL,
    ADD PRIMARY KEY (`idAsistencia`);

-- AlterTable
ALTER TABLE `infoempresa` MODIFY `logo` LONGBLOB NULL DEFAULT null;

-- CreateIndex
CREATE UNIQUE INDEX `Asistencia_idUsuarioEmpleado_fechaCreacion_key` ON `Asistencia`(`idUsuarioEmpleado`, `fechaCreacion`);

-- AddForeignKey
ALTER TABLE `Asistencia` ADD CONSTRAINT `Asistencia_idUsuarioEmpleado_fkey` FOREIGN KEY (`idUsuarioEmpleado`) REFERENCES `Usuarios`(`idUsuario`) ON DELETE RESTRICT ON UPDATE CASCADE;
