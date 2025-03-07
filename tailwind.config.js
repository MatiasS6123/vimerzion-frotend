/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}", // Asegúrate de que Tailwind escanee todos los archivos.
  ],
  theme: {
    extend: {
      backgroundImage: {
        'page-bg': "url('/assets/Fondo-Patron.jpg')",
      },
      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"],
        roboto:["Roboto Flex", "sans-serif"],
        nexaHeavy:["Nexa Heavy","sans-serif"],
        nexaBold:["Nexa Bold","sans-serif"],
        nexaRegular:["Nexa Regular","sans-serif"],
      },
      
    },
  },
  plugins: [],
}