
import {ConfigService} from "@nestjs/config";

export default (email: string, name: string, verification_code: string) => {
    const config = new ConfigService();

    const app_site = config.get<string>('SERVER_URL');
    const app_name = config.get<string>('APP_NAME');
    const app_logo = config.get<string>('SERVER_URL') + "/public/logo-192x192.png";
    const year = new Date().getFullYear();

    return `<div style="background-color:#ffffff;margin:0!important;padding:0!important">
    <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tbody>
        <tr>
            <td bgcolor="" align="center">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px">
                    <tbody>
                    <tr>
                        <td align="center" valign="top" style="padding:40px 10px 10px 30px">
                            <a href="${app_site}" target="_blank">
                                <img label="logo" alt="${app_name}" src="${app_logo}" width="128" height="128">
                            </a>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </td>
        </tr>
        <tr>
            <td bgcolor="#ffffff" align="center" style="padding:0px 10px 0px 10px">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px">
                    <tbody>
                    <tr>
                        <td bgcolor="#ffffff" align="left" style="padding:10px 30px 10px 30px;color:#293042;font-family:'Roboto',Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:27px">
                            <u></u>
                            <a style="text-decoration:none;color:#293042;font-family:'Roboto',Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:27px">
                                Hi ${name}.
                                <br>
                                If you want to reset your password, check this out.
                                <u></u>
                            </a>
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#ffffff" align="left">
                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                <tbody>
                                <tr>
                                    <td bgcolor="#ffffff" align="left" style="padding:20px 30px 30px 30px">
                                        <table border="0" cellspacing="0" cellpadding="0">
                                            <tbody>
                                            <tr>
                                                <td align="left" style="border-radius:3px" bgcolor="#fbcd36">
                                                    <div style="font-size:32px;font-family:Helvetica,Arial,sans-serif;color:black;text-decoration:none;color:black;text-decoration:none;padding:15px 25px;border-radius:2px;border:1px solid #fbcd36;display:inline-block">
                                                        <u></u>${verification_code}<u></u>
                                                    </div>
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#ffffff" align="left" style="padding:0px 30px 40px 30px;color:#293042;font-family:'Roboto',Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:27px">
                            <u></u>Thanks<br>${app_name}<u></u>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </td>
        </tr>
        <tr>
            <td bgcolor="" align="center" style="padding:0px 10px 0px 10px">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px">
                    <tbody>
                    <tr>
                        <td></td>
                    </tr>
                    <tr>
                        <td bgcolor="#ffffff" align="left" style="padding:0px 30px 30px 30px;color:#aeb4bf;font-family:'Roboto',Helvetica,Arial,sans-serif;font-size:12px;font-weight:400;line-height:16px">
                            <p style="margin:0;border-top:1px solid #ebedf2;padding:40px 0px 0 0px">
                                <u></u>
                                © ${year} ${app_name}
                                <u></u>
                            </p>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </td>
        </tr>
        </tbody>
    </table>
</div>`;
};
