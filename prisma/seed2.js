//Archivo seed de inserts
//Inserta lo que se ocupa para que el sistema inicie correctamente
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

async function main() {
    try {
        await Promise.all([

            //Permisos por Rol
            prisma.permisosPorRoles.createMany({
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
            }),

            //Usuario super admin
            prisma.usuarios.create({
                data: {
                    usuario: "SuperAdmin",
                    correo: "admin@mail.com",
                    clave: await bcrypt.hash("P0ll0p3t0t3", 10),
                    nombre: "Superadmin",
                    apellidos: "Admin",
                    direccion: "San José",
                    telefono: "11223344",
                    esEmpleado:false,
                    idRol:1
                },
            }),


        ]);

        console.log('Segundo SEED ejecutado correctamente. Valida si existe otro y ejecútalo');

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
