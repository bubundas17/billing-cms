import { getOption, setOption } from '@lib/options';

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
    siteTitle: await getOption('siteTitle'),
    urlPrifix: await getOption('urlPrifix'),
  });
};

export const postGeneralSettings = async (req, res) => {
  const { siteTitle, urlPrifix } = req.body;
  await setOption('siteTitle', siteTitle);
  await setOption('urlPrifix', urlPrifix);
  res.redirect('/admin/settings/general');
};
