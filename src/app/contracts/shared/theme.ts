export enum ETheme {
  Light,
  Dark
};

export interface IThemeConfig {
  0: ITheme;
  1: ITheme;
}

export interface ITheme {
  theme: string;
  themeIcon: string;
}