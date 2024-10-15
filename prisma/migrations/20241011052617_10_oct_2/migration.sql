-- AlterTable
ALTER TABLE `infoempresa` MODIFY `logo` LONGBLOB NULL DEFAULT null;

-- AddForeignKey
ALTER TABLE `PermisosPorRoles` ADD CONSTRAINT `PermisosPorRoles_idRol_fkey` FOREIGN KEY (`idRol`) REFERENCES `Roles`(`idRol`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PermisosPorRoles` ADD CONSTRAINT `PermisosPorRoles_idPermiso_fkey` FOREIGN KEY (`idPermiso`) REFERENCES `Permisos`(`idPermiso`) ON DELETE RESTRICT ON UPDATE CASCADE;
