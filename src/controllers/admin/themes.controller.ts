import { Request, Response } from 'express';

import { setOption } from '@lib/options';
import theme from '@lib/theme';
import AppError from '@exceptions/AppError';

// Get All Themes
export const getIndex = async (_req: Request, res: Response) => {
  const themes = await theme.allThemes();
  res.render('admin/themes/index', { themes });
};

// Enable Theme by name
export const getEnableTheme = async (req: Request, res: Response) => {
  const { themeName } = req.params;

  try {
    const isAvailable = await theme.isThemeAvailable(themeName);
    if (!isAvailable) return res.send(`Theme - ${themeName} not available`);
    await setOption('is-active-theme', themeName);
    res.redirect('/admin/themes');
  } catch (err) {
    const error = err as AppError;
    res.status(500).json({
      status: 'error',
      message: 'There was an error enabling the theme',
      errorMessage: error.message,
    });
  }
};

// Delete theme by name
export const getDeleteTheme = async (req: Request, res: Response) => {
  const { themeName } = req.params;

  try {
    await theme.removeTheme(themeName);
    res.redirect('/admin/themes');
  } catch (err) {
    const error = err as AppError;
    res.status(500).json({
      status: 'error',
      message: 'There was an error deleting the theme',
      errorMessage: error.message,
    });
  }
};
