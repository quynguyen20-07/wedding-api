import moduleAlias from "module-alias";
import path from "path";

const rootDir = path.resolve(__dirname, "..");

moduleAlias.addAliases({
  "@": path.join(rootDir, "src"),
  "@config": path.join(rootDir, "src/config"),
  "@models": path.join(rootDir, "src/models"),
  "@services": path.join(rootDir, "src/services"),
  "@middleware": path.join(rootDir, "src/middleware"),
  "@graphql": path.join(rootDir, "src/graphql"),
  "@utils": path.join(rootDir, "src/utils"),
  "@repositories": path.join(rootDir, "src/repositories"),
  "@types": path.join(rootDir, "src/types"),
});

console.log("✅ Aliases registered for development");
