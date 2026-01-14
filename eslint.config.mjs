import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt(
  {
    ignores: ["app.vue"], // 一時的にapp.vueを除外
  },
  {
    rules: {
      "vue/multi-word-component-names": "off",
    },
  }
);
