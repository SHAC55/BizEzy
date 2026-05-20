import { prisma } from "../config/db";
import { sendMail } from "./sendMail";
import { getLowStockAlertTemplate } from "./emailTemplates";

type LowStockItem = {
  name: string;
  quantity: number;
  minimumQuantity: number;
  sku?: string | null;
};

export const sendLowStockAlert = async (
  businessId: string,
  items: LowStockItem[],
) => {
  if (items.length === 0) {
    return;
  }

  const business = await prisma.business.findUnique({
    where: { id: businessId },
    select: {
      name: true,
      owner: {
        select: { name: true, email: true },
      },
    },
  });

  if (!business?.owner.email) {
    return;
  }

  const template = getLowStockAlertTemplate({
    businessName: business.name,
    ownerName: business.owner.name,
    items,
  });

  await sendMail({
    to: business.owner.email,
    ...template,
  });
};

export const fireLowStockAlert = (
  businessId: string,
  items: LowStockItem[],
) => {
  if (items.length === 0) {
    return;
  }
  sendLowStockAlert(businessId, items).catch((error) => {
    console.error("low stock alert email failed", error);
  });
};
