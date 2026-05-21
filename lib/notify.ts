import nodemailer from "nodemailer";
import {
  getProfessionalProfileLabel,
  type WaitlistLead,
} from "@/lib/validations";

type WaitlistNotificationMetadata = {
  createdAt: string;
  turnstileStatus: string;
};

type SmtpConfig = {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  password: string;
  notifyTo: string;
  notifyFrom: string;
  sheetUrl?: string;
};

export class WaitlistNotificationError extends Error {
  constructor(
    readonly code: "missing-config" | "invalid-config" | "smtp-failed",
    message: string,
  ) {
    super(message);
    this.name = "WaitlistNotificationError";
  }
}

export async function sendWaitlistNotification(
  lead: WaitlistLead,
  metadata: WaitlistNotificationMetadata,
) {
  const config = getSmtpConfig();
  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.password,
    },
    connectionTimeout: 8_000,
    greetingTimeout: 8_000,
    socketTimeout: 10_000,
  });
  const emailContent = buildWaitlistEmail(lead, metadata, config.sheetUrl);

  try {
    const info = await transporter.sendMail({
      to: config.notifyTo,
      from: config.notifyFrom,
      replyTo: lead.email,
      subject: "Nueva solicitud en Darquis",
      text: emailContent.text,
      html: emailContent.html,
    });

    return { notificationSent: true, messageId: info.messageId };
  } catch (error) {
    throw new WaitlistNotificationError(
      "smtp-failed",
      error instanceof Error ? error.message : "SMTP notification failed.",
    );
  }
}

function getSmtpConfig(): SmtpConfig {
  const env = {
    SMTP_HOST: process.env.SMTP_HOST?.trim(),
    SMTP_PORT: process.env.SMTP_PORT?.trim(),
    SMTP_SECURE: process.env.SMTP_SECURE?.trim(),
    SMTP_USER: process.env.SMTP_USER?.trim(),
    SMTP_PASSWORD: process.env.SMTP_PASSWORD?.trim(),
    WAITLIST_NOTIFY_TO: process.env.WAITLIST_NOTIFY_TO?.trim(),
    WAITLIST_NOTIFY_FROM: process.env.WAITLIST_NOTIFY_FROM?.trim(),
  };
  const missing = Object.entries(env)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    throw new WaitlistNotificationError(
      "missing-config",
      `Missing SMTP waitlist configuration: ${missing.join(", ")}.`,
    );
  }

  const smtpPort = readPresentEnvValue(env.SMTP_PORT, "SMTP_PORT");
  const port = Number(smtpPort);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new WaitlistNotificationError(
      "invalid-config",
      "SMTP_PORT must be a valid TCP port.",
    );
  }

  return {
    host: readPresentEnvValue(env.SMTP_HOST, "SMTP_HOST"),
    port,
    secure: parseBooleanEnv(readPresentEnvValue(env.SMTP_SECURE, "SMTP_SECURE"), "SMTP_SECURE"),
    user: readPresentEnvValue(env.SMTP_USER, "SMTP_USER"),
    password: readPresentEnvValue(env.SMTP_PASSWORD, "SMTP_PASSWORD"),
    notifyTo: readPresentEnvValue(env.WAITLIST_NOTIFY_TO, "WAITLIST_NOTIFY_TO"),
    notifyFrom: readPresentEnvValue(env.WAITLIST_NOTIFY_FROM, "WAITLIST_NOTIFY_FROM"),
    sheetUrl: process.env.WAITLIST_SHEET_URL?.trim() || undefined,
  };
}

function readPresentEnvValue(value: string | undefined, key: string) {
  if (!value) {
    throw new WaitlistNotificationError(
      "missing-config",
      `Missing SMTP waitlist configuration: ${key}.`,
    );
  }

  return value;
}

function buildWaitlistEmail(
  lead: WaitlistLead,
  metadata: WaitlistNotificationMetadata,
  sheetUrl?: string,
) {
  const source = lead.source ? `darquis.com/${lead.source}` : "darquis.com";
  const profile = getProfessionalProfileLabel(lead.profile) || "No indicado";
  const rows = [
    ["Email", lead.email],
    ["Perfil", profile],
    ["Fecha", metadata.createdAt],
    ["Origen", source],
    ["Privacidad aceptada", lead.privacyAccepted ? "si" : "no"],
    ["Estado antirobots", metadata.turnstileStatus],
  ];
  const sheetLines = sheetUrl ? ["", "Ver Google Sheet:", sheetUrl] : [];
  const text = [
    "Nueva solicitud en la lista de espera de Darquis.",
    "",
    ...rows.map(([label, value]) => `${label}: ${value}`),
    ...sheetLines,
  ].join("\n");
  const htmlRows = rows
    .map(
      ([label, value]) => `
        <tr>
          <th align="left" style="padding:6px 12px 6px 0;color:#182935;">${escapeHtml(label)}</th>
          <td style="padding:6px 0;color:#2f4858;">${escapeHtml(value)}</td>
        </tr>`,
    )
    .join("");
  const html = `
    <p>Nueva solicitud en la lista de espera de Darquis.</p>
    <table role="presentation" cellspacing="0" cellpadding="0">
      <tbody>${htmlRows}</tbody>
    </table>
    ${
      sheetUrl
        ? `<p>Ver Google Sheet:<br><a href="${escapeHtml(sheetUrl)}">${escapeHtml(sheetUrl)}</a></p>`
        : ""
    }
  `;

  return { text, html };
}

function parseBooleanEnv(value: string, key: string) {
  const normalized = value.toLowerCase();

  if (normalized === "true") {
    return true;
  }

  if (normalized === "false") {
    return false;
  }

  throw new WaitlistNotificationError(
    "invalid-config",
    `${key} must be "true" or "false".`,
  );
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
