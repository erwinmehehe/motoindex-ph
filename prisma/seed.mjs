import { PrismaClient } from "@prisma/client";
const prisma=new PrismaClient();
try{
  await prisma.seller.upsert({where:{slug:"sb-finance-repo-central"},update:{name:"SB Finance Repo Central",type:"official",website:"https://www.sbfinance.com.ph/repo-central-catalogue/",status:"verified"},create:{name:"SB Finance Repo Central",slug:"sb-finance-repo-central",type:"official",website:"https://www.sbfinance.com.ph/repo-central-catalogue/",status:"verified"}});
  console.log("Seeded verified ingestion seller: SB Finance Repo Central");
}finally{await prisma.$disconnect();}
