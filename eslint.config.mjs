import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import react, { rules } from "eslint-plugin-react";
import prettierRecommended from "eslint-plugin-prettier/recommended";

export default tseslint.config(
  eslint.configs.recommended,
  react.configs.flat.recommended,
  prettierRecommended,
  ...tseslint.configs.recommended,
 {
        'prettier/prettier': 0
      },
  {
    settings: {
      react: {
        version: "detect",
      },
     
    },
  },
);
