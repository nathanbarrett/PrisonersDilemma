import { ThemeDefinition } from "vuetify";
import colors from 'vuetify/util/colors';

export const LivvDarkTheme: ThemeDefinition = {
    dark: true,
    colors: {
        background: 'rgb(0, 26, 42)',
        surface: colors.grey.darken4,
        primary: colors.indigo.darken1,
        secondary: colors.amber.darken1,
        info: colors.lightBlue.lighten1,
        accent: colors.teal.darken2,
    }
};

export const LivvLightTheme: ThemeDefinition = {
    dark: false,
    colors: {
        background: colors.grey.lighten3,
        surface: colors.grey.lighten4,
        primary: 'rgb(0, 125, 210)',
        secondary: 'rgb(237, 80, 30)',
        info: colors.lightBlue.lighten1,
        accent: colors.teal.lighten2,
    }
};
