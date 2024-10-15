-- DropForeignKey
ALTER TABLE `permisosporroles` DROP FOREIGN KEY `PermisosPorRoles_idPermiso_fkey`;

-- DropForeignKey
ALTER TABLE `permisosporroles` DROP FOREIGN KEY `PermisosPorRoles_idRol_fkey`;

-- AlterTable
ALTER TABLE `infoempresa` MODIFY `logo` LONGBLOB NULL DEFAULT null;
