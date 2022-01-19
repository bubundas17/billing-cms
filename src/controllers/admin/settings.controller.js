import { getOption, setOption } from '@lib/options';

// import enums
import settings from '@enums/settings.enum';
/**
 * @reqtype GET
 * @param {*} req
 * @param {*} res
 * @description settings index page
 */
export const getIndex = (req, res) => {
  res.render('admin/settings/index');
};

export const getGeneralSettings = async (req, res) => {
  res.render('admin/settings/general', {
    siteTitle: await getOption(settings.SITE_TITLE),
    urlPrifix: await getOption(settings.URL_PREFIX),
  });
};

export const postGeneralSettings = async (req, res) => {
  const { siteTitle, urlPrifix } = req.body;
  await setOption(settings.SITE_TITLE, siteTitle);
  await setOption(settings.URL_PREFIX, urlPrifix);
  res.redirect('/admin/settings/general');
};
