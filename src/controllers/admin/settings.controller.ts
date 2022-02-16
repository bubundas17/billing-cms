import { Request, Response } from 'express';
import nodemailer from 'nodemailer';

// import { getOption, setOption } from '@lib/options';
// import settings from '@enums/settings.enum';

// settings index page
export const getIndex = (_req: Request, res: Response) =>
  res.render('admin/settings/index');

export const getGeneralSettings = async (_req: Request, res: Response) => {
  res.render('admin/settings/general', {
    // siteTitle: await getOption(settings.SITE_TITLE),
    // urlPrifix: await getOption(settings.URL_PREFIX),
  });
};

export const postGeneralSettings = async (_req: Request, res: Response) => {
  // const { siteTitle, urlPrifix } = req.body;

  // await setOption(settings.SITE_TITLE, siteTitle);
  // await setOption(settings.URL_PREFIX, urlPrifix);

  res.redirect('/admin/settings/general');
};

// get email settings
export const getEmailSettings = async (_req: Request, res: Response) => {
  res.render('admin/settings/email', {
    // emailHost: await getOption(settings.EMAIL_HOST),
    // emailPort: await getOption(settings.EMAIL_PORT),
    // emailUsername: await getOption(settings.EMAIL_USERNAME),
    // emailPassword: await getOption(settings.EMAIL_PASSWORD),
    // emailFromAddress: await getOption(settings.EMAIL_FROM_ADDRESS),
    // emailFromName: await getOption(settings.EMAIL_FROM_NAME),
    // emailEnableSsl: await getOption(settings.EMAIL_ENABLE_SSL),
    // emailProvider: await getOption(settings.EMAIL_PROVIDER),
  });
};

// post email settings
export const postEmailSettings = async (_req: Request, res: Response) => {
  // const {
  //   emailHost,
  //   emailPort,
  //   emailUsername,
  //   emailPassword,
  //   emailFromAddress,
  //   emailFromName,
  //   emailEnableSsl,
  //   emailProvider,
  // } = req.body;

  // await setOption(settings.EMAIL_HOST, emailHost);
  // await setOption(settings.EMAIL_PORT, emailPort);
  // await setOption(settings.EMAIL_USERNAME, emailUsername);
  // await setOption(settings.EMAIL_PASSWORD, emailPassword);
  // await setOption(settings.EMAIL_FROM_ADDRESS, emailFromAddress);
  // await setOption(settings.EMAIL_FROM_NAME, emailFromName);
  // await setOption(settings.EMAIL_ENABLE_SSL, emailEnableSsl);
  // await setOption(settings.EMAIL_PROVIDER, emailProvider);

  res.redirect('/admin/settings/email');
};

// test if the SMTP server is working without sending email
export const postTestEmailSettings = async (req: Request, res: Response) => {
  const {
    emailHost,
    emailPort,
    emailUsername,
    emailPassword,
    emailFromAddress,
    emailFromName,
    emailEnableSsl,
    // emailProvider,
  } = req.body;

  const transporter = nodemailer.createTransport({
    host: emailHost,
    port: emailPort,
    secure: emailEnableSsl,
    auth: {
      user: emailUsername,
      pass: emailPassword,
    },
  });

  const mailOptions = {
    from: `${emailFromName} <${emailFromAddress}>`,
    to: emailUsername,
    subject: 'Test Email',
    text: 'This is a test email',
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.json({ error: true, message: error.message });
    } else {
      res.json({ error: false, message: info.response });
    }
  });
};
