import nodemailer, { TransportOptions, Transporter } from "nodemailer";
import getEnv from "../config/env.config";
import logger from "./logger.utils";

const {
  EMAIL_HOST: host,
  EMAIL_PASSWORD: pass,
  EMAIL_PORT: port,
  EMAIL: user,
} = getEnv();

export class Mailer {
  private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host,
      port,
      auth: {
        user,
        pass,
      },
    } as TransportOptions);
  }

  async SendMail(
    to: string,
    subject?: string,
    html?: string,
    text?: string,
    template?: string,
    data?: string
  ) {
    try {
      const mailOptions = {
        from: `<${user}>`,
        to,
        subject,
        html,
      };
      const info = await this.transporter.sendMail(mailOptions);
      logger.info(`Email sent: ${info.messageId}`);
    } catch (error) {
      logger.error(`Error sending email: ${error}`);
      throw error;
    }
  }
}
