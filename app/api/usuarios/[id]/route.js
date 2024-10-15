const { PrismaClient } = require('@prisma/client');
import { NextResponse } from 'next/server';
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

//Listado de usuarios
export async function GET(request, { params }) {
    const { id } = params;
  
    try {
      const usuario = await prisma.usuarios.findUnique({
        where: { idUsuario: Number(id) },
        select: {
          idUsuario:true,  
          nombre:true,
          apellidos:true,
          correo:true,
          telefono:true,
          idRol:true,
          usuario:true,
          esEmpleado:true,
          direccion:true
        },
      });
  
      if (!usuario) {
        return NextResponse.json({
          code: 204,
          status: "failed",
          message: "No se encontraron registros.",
        }, { status: 204 });
      }
  
      
      return NextResponse.json({
        code: 200,
        status: "success",
        data:usuario,
        message: "Se ha obtenido el usuario satisfactoriamente",
      }, { status: 200 });
  
    } 
    catch (error) {
      console.error('Error al obtener el usuario:', error);
      return NextResponse.json({
        code: 500,
        status: "error",
        message: "Error al obtener el usuario: " + error.message,
      }, { status: 500 });
    }
  }
