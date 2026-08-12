import nodemailer, { type Transporter } from 'nodemailer';
import path from 'path';
import ejs from 'ejs';
// Dotenv configuration
import "dotenv/config"
import { fileURLToPath } from 'url';

// Get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


interface EmailOption {
    email: string;
    subject: string;
    template: string;
    data: { [key: string]: any };
};


const sendMail = async (options: EmailOption): Promise<void> => {
    const transporter: Transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || "587"),
        service: process.env.SMTP_SERVICE,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    const { email, subject, template, data } = options;

    // Get the path
    const templatePath = path.join(__dirname, "../mails", template);

    // Reder the template
    const html: string = await ejs.renderFile(templatePath, data);

    // Send the mail
    const mailOptions = {
        from: process.env.SMTP_USER,
        to: email,
        subject,
        html
    };

    await transporter.sendMail(mailOptions);
};

export default sendMail;