const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function clearData() {
  try {
    await prisma.evidence.deleteMany({});
    await prisma.aunqaRecord.deleteMany({});
    await prisma.file.deleteMany({});
    console.log('Cleared all evidence, records, and files successfully.');
  } catch (error) {
    console.error('Error clearing data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

clearData();
