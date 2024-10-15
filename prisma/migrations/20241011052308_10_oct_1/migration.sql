-- DropIndex
DROP INDEX `PermisosPorRoles_idPermiso_fkey` ON `permisosporroles`;

-- AlterTable
ALTER TABLE `infoempresa` MODIFY `logo` LONGBLOB NULL DEFAULT null;
