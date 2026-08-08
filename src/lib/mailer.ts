import "server-only";

import nodemailer from "nodemailer";

import { serverEnv } from "@/lib/env";

let transporter: nodemailer.Transporter | null = null;

/** Lazily constructed so a missing SMTP config fails at request time, not build time. */
export function mailer(): nodemailer.Transporter {
  if (!transporter) {
    const port = Number(serverEnv.smtpPort);
    transporter = nodemailer.createTransport({
      host: serverEnv.smtpHost,
      port,
      secure: port === 465,
      auth: { user: serverEnv.smtpUser, pass: serverEnv.smtpPass },
    });
  }
  return transporter;
}
