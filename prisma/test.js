//Archivo de queries de pruebas
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

async function main() {
    try {
        
        const permisosPorRoles = prisma.permisosPorRoles.createMany({
            data: [
                { idPermiso: 1, idRol: 1 },
                { idPermiso: 2, idRol: 1 },
                { idPermiso: 3, idRol: 1 },
                { idPermiso: 4, idRol: 1 },
                { idPermiso: 5, idRol: 1 },
                { idPermiso: 6, idRol: 1 },
                { idPermiso: 7, idRol: 1 },
                { idPermiso: 8, idRol: 1 },
                { idPermiso: 9, idRol: 1 },
                { idPermiso: 10, idRol: 1 },
                { idPermiso: 11, idRol: 1 },
                { idPermiso: 12, idRol: 1 },
                { idPermiso: 13, idRol: 1 },
                { idPermiso: 14, idRol: 1 },
                { idPermiso: 15, idRol: 1 },
                { idPermiso: 16, idRol: 1 },
                { idPermiso: 17, idRol: 1 },
                { idPermiso: 18, idRol: 1 },
                { idPermiso: 19, idRol: 1 },
                { idPermiso: 20, idRol: 1 },
            ]
        })

        console.log("Creados los permisos: " + permisosPorRoles)

    }
    catch (e) {
        console.error(e);
        process.exit(1);
    }
    finally {
        await prisma.$disconnect();
    }
}

main();
