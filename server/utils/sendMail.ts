import resend from "../config/resend";

type Params = {
  to: string;
  subject: string;
  text: string;
  html: string;
};
export const sendMail = async ({ to, subject, text, html }: Params) => {
  console.log("[sendMail] dispatching", { to, subject });
  const response = await resend.emails.send({
    from: "no-reply@faizan.store",
    to,
    subject,
    text,
    html,
  });
  console.log("[sendMail] resend response", response);
  if (response.error) {
    console.error("[sendMail] resend returned error", response.error);
  }
  return response;
};
