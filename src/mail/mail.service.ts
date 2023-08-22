
import { Injectable } from '@nestjs/common';
import {ConfigService} from "@nestjs/config";
import VerificationCodeHtml from "./verification-code-html";

@Injectable()
export class MailService {
    constructor(private config: ConfigService) {}

    async sendVerificationEmail(email: string, name: string, verification_code: string): Promise<void> {
        // TODO: implement this method

        // const transporter = nodemailer.createTransport({
        //     host: this.config.get('MAIL_HOST'),
        //     port: this.config.get('MAIL_PORT'),
        //     secure: false,
        //     auth: {
        //         user: this.config.get('MAIL_USERNAME'),
        //         pass: this.config.get('MAIL_PASSWORD'),
        //     },
        // });
        // const mailOptions = {
        //     from: this.config.get('MAIL_FROM_NAME') + ' <' + this.config.get('MAIL_FROM') + '>',
        //     to: email,
        //     subject: "Verification Code",
        //     html: VerificationCodeHtml(email, name, verification_code),
        // };
        // await transporter.sendMail(mailOptions);

        console.log("Verification code sent to " + email);
    }

}
