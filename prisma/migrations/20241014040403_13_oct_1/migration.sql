-- AlterTable
ALTER TABLE `infoempresa` MODIFY `logo` LONGBLOB NULL DEFAULT null;

-- AlterTable
ALTER TABLE `metas` ADD COLUMN `vistoEmpleado` BOOLEAN NULL;
