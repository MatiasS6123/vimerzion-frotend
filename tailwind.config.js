/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}", // Asegúrate de que Tailwind escanee todos los archivos.
  ],
  theme: {
    extend: {
      backgroundImage: {
        'page-gradient-pattern': 'linear-gradient(15deg, #682be2, #1f1062), url("/assets/patron_optimizado.svg")',
      },
      
    },
  },
  plugins: [],
}