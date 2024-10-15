import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()

export async function FindAll(model) {
  return await prisma[model].findMany();
}

export async function FindById(model, id) {
  return await prisma[model].findUnique({ where: { id:id } });
}

export async function Create(model, data) {
  return await db[model].create({ data });
}

export async function Update(model, id, data) {
  return await prisma[model].update({ where: { id:id }, data });
}

export async function Delete(model, id) {
  return await db[model].delete({ where: { id } });
}

//Other methods:
export async function FindSpecificOptions(model, selectFields) {
  const queryOptions = {};

  if (selectFields) {
    queryOptions.select = selectFields;
  }

  return await db[model].findMany(queryOptions);
}


export async function FindWithLike(model, value, dbParameters) {
  const whereOptions = {
    OR: dbParameters.map(param => ({
      [param]: {
        contains: value,
      }
    }))
  };

  const queryOptions = {
    where: whereOptions
  };

  console.log(queryOptions)

  return await prisma[model].findMany(queryOptions);
}

