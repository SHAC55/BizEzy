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
  console.log("[lowStockAlert] start", {
    businessId,
    itemCount: items.length,
    items,
  });

  if (items.length === 0) {
    console.log("[lowStockAlert] no items, skipping");
    return;
  }

  const business = await prisma.business.findUnique({
    where: { id: businessId },
    select: {
      name: true,
      owner: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  console.log("[lowStockAlert] business lookup", {
    found: Boolean(business),
    businessName: business?.name,
    ownerId: business?.owner.id,
    ownerName: business?.owner.name,
    ownerEmail: business?.owner.email,
  });

  if (!business) {
    console.warn("[lowStockAlert] business not found, skipping");
    return;
  }

  if (!business.owner.email) {
    console.warn(
      "[lowStockAlert] owner has no email on file, skipping",
      { ownerId: business.owner.id },
    );
    return;
  }

  const template = getLowStockAlertTemplate({
    businessName: business.name,
    ownerName: business.owner.name,
    items,
  });

  console.log("[lowStockAlert] sending mail", {
    to: business.owner.email,
    subject: template.subject,
    hasResendKey: Boolean(process.env.RESEND_API_KEY),
  });

  try {
    const response = await sendMail({
      to: business.owner.email,
      ...template,
    });
    console.log("[lowStockAlert] sendMail returned", response);
  } catch (error) {
    console.error("[lowStockAlert] sendMail threw", error);
    throw error;
  }
};

export const fireLowStockAlert = (
  businessId: string,
  items: LowStockItem[],
) => {
  console.log("[lowStockAlert] fire", {
    businessId,
    itemCount: items.length,
  });
  if (items.length === 0) {
    return;
  }
  sendLowStockAlert(businessId, items).catch((error) => {
    console.error("[lowStockAlert] failed", error);
  });
};
