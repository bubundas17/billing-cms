import { getOption, setOption } from '@lib/options';
import theme from '@lib/theme';

/**
 * @description Get All Themes
 *
 * @param {object} req
 * @param {object} res
 * @returns {Promise}
 */
export const getIndex = async (req, res) => {
  const themes = await theme.allThemes();
  console.log(themes);
  res.render('admin/themes/index', { themes });
};

export const getEnableTheme = async (req, res) => {
  const { themeName } = req.params;

  try {
    const isAvailable = await theme.isThemeAvailable(themeName);
    if (!isAvailable) return res.send(`Theme - ${themeName} not available`);
    await setOption('is-active-theme', themeName);
    await res.redirect('/admin/themes');
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'There was an error enabling the theme',
      errorMessage: error.message,
    });
  }
};

export const getDeleteTheme = async (req, res) => {
  const { themeName } = req.params;

  try {
    await theme.removeTheme(themeName);
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
