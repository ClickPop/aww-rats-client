/** @type {import("@types/tailwindcss/tailwind-config").TailwindConfig } */
module.exports = {
  purge: ['./src/**/*.tsx'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        light: '#FFF4CF',
        dark: '#2A353C',
        slate: '#3F505A',
        tan: '#fffae8',
      },
      spacing: {
        fit: 'fit-content',
        max: 'max-content',
        min: 'min-content',
        128: '32rem',
      },
      listStyleType: {
        circle: 'circle',
      },
      maxHeight: {
        '1/2': '50%',
        '2/3': '66%',
      },
    },
  },
  variants: {
    extend: {
      accessibility: ['group-hover', 'hover', 'focus'],
      inset: ['group-hover', 'hover', 'focus'],
    }
  },
  plugins: [
    require('@neupauer/tailwindcss-plugin-colors'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/forms'),
  ],
};
