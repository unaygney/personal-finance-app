/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    "postcss-pxtorem": {
      rootValue: 16,
      propList: ["*"],
    },
    tailwindcss: {},
  },
};

export default config;
