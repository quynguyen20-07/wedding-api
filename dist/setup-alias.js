"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const module_alias_1 = __importDefault(require("module-alias"));
const path_1 = __importDefault(require("path"));
const rootDir = path_1.default.resolve(__dirname, "..");
module_alias_1.default.addAliases({
    "@": path_1.default.join(rootDir, "src"),
    "@config": path_1.default.join(rootDir, "src/config"),
    "@models": path_1.default.join(rootDir, "src/models"),
    "@services": path_1.default.join(rootDir, "src/services"),
    "@middleware": path_1.default.join(rootDir, "src/middleware"),
    "@graphql": path_1.default.join(rootDir, "src/graphql"),
    "@utils": path_1.default.join(rootDir, "src/utils"),
    "@repositories": path_1.default.join(rootDir, "src/repositories"),
    "@types": path_1.default.join(rootDir, "src/types"),
});
console.log("✅ Aliases registered for development");
//# sourceMappingURL=setup-alias.js.map