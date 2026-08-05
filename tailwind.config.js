
const { nextui } = require("@nextui-org/react");
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],



  theme: {
    extend: {
      fontFamily: {
        'noticia': ['"Noticia Text"', 'serif'],
        'Philosopher': ['"Philosopher"', 'sans- serif'],
        'lucida-bright-regular': ['"lucida-bright-regular"', 'sans-serif'],
        'raleway': ['"Raleway"', 'sans-serif'],
        'Cormorant Garamond': ['"Cormorant Garamond"', 'serif'],
        'Lobster Two': ['"Lobster Two"', 'cursive'],
        'Montserrat': ['"Montserrat"', 'sans-serif'],
        'Roboto': ['"Roboto"', 'sans-serif!important'],
        'Tanseek Modern': ['"Tanseek Modern Arabic"', 'Tanseek Modern Arabic Bold'],
        'AwanZaman Heavy': ['"AwanZaman Heavy"', 'AwanZaman Heavy'],
        'Poppins': ['"Poppins"', 'sans-serif'],
        'Outfit': ['"Outfit", sans-serif'],
        'Potua': ['Potua'],
        'OpenSan': ['"Open Sans", "Roboto", "Arial", "sans-serif"'],
        'Lato': ['"Lato", serif'],
        'Jersy': ['"Jersey 25"'],
        'Cursive': ['"Style Script", cursive'],
        'PlayWrite': ['"Playwrite NO", cursive'],
        'BitCount': ['"Bitcount Prop Single", system-ui'],
        'Cake': ['"Cinzel Decorative", serif'],
        'Rose': ['"Red Rose", serif']

      },
      screens: {
        'md150': '1650px',
        'md140': '1410px',

        'md11': '1024px',
        'md77': '770px',
        'md57': '570px',
        'md36': '360px',


        'md83': '830px',
        'md118': '1180px',
        'md127': '1270px',

      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
}