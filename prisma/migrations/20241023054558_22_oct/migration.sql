-- DropIndex
DROP INDEX `idx_idCliente` ON `facturas`;

-- AlterTable
ALTER TABLE `infoempresa` MODIFY `logo` LONGBLOB NULL DEFAULT null;
