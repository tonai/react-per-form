/* eslint-disable import/newline-after-import */
import sdk from '@stackblitz/sdk';
import { compressToBase64 } from 'lz-string';

// @ts-expect-error raw loader
import timeTs from '!!raw-loader!@site/src/demo/time';
// @ts-expect-error raw loader
import typesTs from '!!raw-loader!@site/src/demo/types';
// @ts-expect-error raw loader
import useDataTs from '!!raw-loader!@site/src/demo/useData';

interface IPackageJson {
  dependencies: Record<string, string>;
  description: string;
  name: string;
  scripts?: Record<string, string>;
}

export interface IFile {
  content: IPackageJson | string;
  isBinary: boolean;
}

export type IFiles = Record<string, IFile>;

export type IDemoType = 'CodeSandbox' | 'StackBlitz';

export function isStackBlitz(type: IDemoType): boolean {
  return type === 'StackBlitz';
}

export function getIndexHtml(type: IDemoType): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>react-swift-form</title>
  </head>
  <body>
    <div id="root"></div>
    ${isStackBlitz(type) ? '<script type="module" src="src/index.tsx"></script>' : ''}
  </body>
</html>`;
}

export function getIndexTsx(type: IDemoType): string {
  return `import React from 'react';
import ReactDOM from 'react-dom/client';
import Demo from ${isStackBlitz(type) ? "'./demo'" : "'./src/demo'"};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Demo />
  </React.StrictMode>,
);`;
}

export function getPackageJson(type: IDemoType): IPackageJson {
  const packageJson: IPackageJson = {
    dependencies: {
      '@types/react': 'latest',
      '@types/react-dom': 'latest',
      react: 'latest',
      'react-dom': 'latest',
      'react-swift-form': 'latest',
    },
    description: location.href,
    name: 'react-swift-form-app',
  };
  if (isStackBlitz(type)) {
    packageJson.dependencies['@vitejs/plugin-react-swc'] = 'latest';
    packageJson.dependencies.vite = 'latest';
    packageJson.scripts = {
      dev: 'vite',
    };
  }
  return packageJson;
}

export function getTsConfigJson(): string {
  return `{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}`;
}

export function getViteConfigTs(): string {
  return `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
});`;
}

export function compress(input: string): string {
  return compressToBase64(input)
    .replace(/\+/g, `-`) // Convert '+' to '-'
    .replace(/\//g, `_`) // Convert '/' to '_'
    .replace(/=+$/, ``); // Remove ending '='
}

export function getParameters(parameters: { files: IFiles }): string {
  return compress(JSON.stringify(parameters));
}

export function getCodeSandboxUrl(code: string): string {
  const packageJson = getPackageJson('CodeSandbox');
  const files: IFiles = {
    'index.html': { content: getIndexHtml('CodeSandbox'), isBinary: false },
    'index.tsx': { content: getIndexTsx('CodeSandbox'), isBinary: false },
    'package.json': { content: packageJson, isBinary: false },
    'src/demo.tsx': { content: code, isBinary: false },
    'tsconfig.json': { content: getTsConfigJson(), isBinary: false },
    'types.ts': { content: typesTs as string, isBinary: false },
  };
  if (code.includes("from '../time'")) {
    files['time.ts'] = { content: timeTs as string, isBinary: false };
  }
  if (code.includes("from '../useData'")) {
    files['useData.ts'] = { content: useDataTs as string, isBinary: false };
  }
  const parameters = getParameters({ files });
  return `https://codesandbox.io/api/v1/sandboxes/define?parameters=${parameters}&query=${encodeURIComponent('file=src/demo.tsx')}`;
}

export function openStackBlitz(code: string): void {
  const packageJson = getPackageJson('StackBlitz');
  const files: Record<string, string> = {
    'index.html': getIndexHtml('StackBlitz'),
    'package.json': JSON.stringify(packageJson, null, 2),
    'src/demo.tsx': code,
    'src/index.tsx': getIndexTsx('StackBlitz'),
    'tsconfig.json': getTsConfigJson(),
    'types.ts': typesTs as string,
    'vite.config.ts': getViteConfigTs(),
  };
  if (code.includes("from '../time'")) {
    files['time.ts'] = timeTs as string;
  }
  if (code.includes("from '../useData'")) {
    files['useData.ts'] = useDataTs as string;
  }
  sdk.openProject(
    {
      description: packageJson.description,
      files,
      template: 'node',
      title: packageJson.name,
    },
    { openFile: 'src/demo.tsx' },
  );
}
