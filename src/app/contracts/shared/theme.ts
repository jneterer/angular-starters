export enum ETheme {
  Light,
  Dark
};

export interface IThemeConfig {
  0: ITheme;
  1: ITheme;
}

export interface ITheme {
  logoUrl: string;
  headerLogoUrl: string;
  themeIcon: string;
  githubIcon: string;
  twitterIcon: string;
  linkedinIcon: string;
}