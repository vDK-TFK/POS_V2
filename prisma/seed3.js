//Archivo seed de inserts
//Inserta lo que se ocupa para que el sistema inicie correctamente
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

async function main() {
    try {
        await Promise.all([

            prisma.permisosPorRoles.createMany({
                data: [
                    { idPermiso: 2, idRol: 2 },
                    { idPermiso: 3, idRol: 2 },
                    { idPermiso: 4, idRol: 2 },
                    { idPermiso: 8, idRol: 2 },
                    { idPermiso: 12, idRol:2 },
                    { idPermiso: 13, idRol:2 },

                ]
            }),

        //Crear el empleado
            prisma.usuarios.create({
                data: {
                    usuario: "Empleado",
                    correo: "empleado@mail.com",
                    clave: await bcrypt.hash("Empl34d0", 10),
                    nombre: "Empleado",
                    apellidos: "Empleado",
                    direccion: "San José",
                    telefono: "11223344",
                    esEmpleado:true,
                    idRol:2,
                    oculto:false,
                    intentos:3,
                    bloqueado:false
                },
            }),

            


        ]);

        console.log('Tercer SEED ejecutado correctamente. Valida si existe otro y ejecútalo');

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
