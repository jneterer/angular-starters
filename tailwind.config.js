module.exports = {
  mode: 'jit',
  purge: [
    './src/**/*.{ts,html,scss}',
  ],
  darkMode: false,
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
