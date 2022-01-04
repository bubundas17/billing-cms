import theme from '@lib/theme';
import themeModel from '@models/theme.model';

/**
 * @description Get All Themes
 *
 * @param {object} req
 * @param {object} res
 * @returns {Promise}
 */
export const getIndex = async (req, res) => {
  const themes = await themeModel.find({}).sort({ status: -1 }).lean();
  res.render('admin/themes/index', { themes });
};

export const postEnableTheme = async (req, res) => {
  const { themeName } = req.body;

  try {
    const themes = await themeModel.find();
    themes.forEach(async (theme) => {
      theme.status = theme.name === themeName;
      await theme.save();
    });
    res.redirect('/admin/themes');
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'There was an error enabling the theme',
      errorMessage: error.message,
    });
  }
};

export const postDeleteTheme = async (req, res) => {
  const { themeName } = req.body;

  try {
    await theme.removeTheme(themeName);
    await themeModel.deleteOne({ name: themeName });
    res.redirect('/admin/themes');
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'There was an error deleting the theme',
      errorMessage: error.message,
    });
  }
};
