const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  publicPath: process.env.NODE_ENV === "production" ? "/JourneyCalendar/" : "/",
  transpileDependencies: true,
  lintOnSave: false, // Disable ESLint during serve to avoid version conflicts
  chainWebpack: (config) => {
    // Ensure TypeScript files are resolved correctly
    config.resolve.extensions
      .merge([".ts", ".tsx", ".js", ".jsx", ".vue", ".json"])
      .end();

    // Set the correct entry point for TypeScript
    config.entry("app").clear().add("./src/main.ts");

    // Configure template compilation to use JavaScript instead of TypeScript
    config.module
      .rule("vue")
      .use("vue-loader")
      .tap((options) => {
        return {
          ...options,
          compilerOptions: {
            ...(options?.compilerOptions || {}),
          },
        };
      });

    // Ensure templates are compiled as JavaScript
    config.module
      .rule("vue")
      .use("vue-loader")
      .loader("vue-loader")
      .tap((options) => {
        options.compilerOptions = options.compilerOptions || {};
        options.compilerOptions.whitespace = "preserve";
        return options;
      });
  },
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: "ts-loader",
          exclude: /node_modules/,
          options: {
            appendTsSuffixTo: [/\.vue$/],
            transpileOnly: true,
          },
        },
      ],
    },
  },
});
