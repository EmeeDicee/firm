import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

async function main() {
  // ✅ Update all existing users with secretId and upgradeCode if missing
  const users = await prisma.user.findMany();

  for (const user of users) {
    const updateData: { secretId?: string; upgradeCode?: string } = {};

    if (!user.secretId) updateData.secretId = randomUUID();
    if (!user.upgradeCode) updateData.upgradeCode = randomUUID();

    if (Object.keys(updateData).length > 0) {
      await prisma.user.update({
        where: { id: user.id },
        data: updateData,
      });
    }
  }

  console.log('✅ Updated all existing users with secretId and upgradeCode');

  // ✅ Upsert app setting for BTC wallet
  await prisma.appSetting.upsert({
    where: { key: 'btc_wallet' },
    update: {},
    create: {
      key: 'btc_wallet',
      value: 'bc1qexamplewalletaddress123',
    },
  });

  console.log('✅ BTC wallet app setting upserted');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
