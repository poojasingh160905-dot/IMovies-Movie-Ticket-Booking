const fs = require('fs');
const path = require('path');

const nativeJsPath = path.join(__dirname, '..', 'node_modules', 'rollup', 'dist', 'native.js');

if (fs.existsSync(nativeJsPath)) {
  let content = fs.readFileSync(nativeJsPath, 'utf8');
  if (!content.includes('@rollup/wasm-node/dist/native.js')) {
    content = content.replace(
      "if (error instanceof Error && error.code === 'ERR_DLOPEN_FAILED') {",
      "if (error instanceof Error && error.code === 'ERR_DLOPEN_FAILED') {\n\t\t\ttry { return require('@rollup/wasm-node/dist/native.js'); } catch (_) {}"
    );
    fs.writeFileSync(nativeJsPath, content, 'utf8');
    console.log('✔ Applied Rollup WASM compatibility patch for Windows Application Control.');
  }
}
