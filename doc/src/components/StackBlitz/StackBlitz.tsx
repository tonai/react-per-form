/* eslint-disable import/newline-after-import */
import type { ReactElement } from 'react';

import sdk from '@stackblitz/sdk';

import Icon from '@site/static/img/stackblitz.svg';

import ActionButton from '../Actionbutton/ActionButton';

// @ts-expect-error raw loader
import timeTs from '!!raw-loader!@site/src/demo/time';
// @ts-expect-error raw loader
import typesTs from '!!raw-loader!@site/src/demo/types';
// @ts-expect-error raw loader
import useDataTs from '!!raw-loader!@site/src/demo/useData';

interface IStackBlitzProps {
  code: string;
}

const indexHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + React + TS</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="src/main.tsx"></script>
  </body>
</html>`;

const mainTsx = `import React from 'react';
import ReactDOM from 'react-dom/client';
import Demo from './demo';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Demo />
  </React.StrictMode>,
);`;

const packageJson = `{
  "name": "react-swift-form-app",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-swift-form": "latest"
  },
  "devDependencies": {
    "@types/react": "^18.2.66",
    "@types/react-dom": "^18.2.22",
    "@vitejs/plugin-react-swc": "^3.5.0",
    "typescript": "^5.2.2",
    "vite": "^5.2.0"
  }
}`;

const tsConfigJson = `{
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

const viteConfigTs = `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
});`;

const title = 'react-swift-form generated project';
const defaultFiles = {
  'index.html': indexHtml,
  'package.json': packageJson,
  'src/main.tsx': mainTsx,
  'tsconfig.json': tsConfigJson,
  'types.ts': typesTs as string,
  'vite.config.ts': viteConfigTs,
};

export default function StackBlitz(props: IStackBlitzProps): ReactElement {
  const { code } = props;
  function handleClick(): void {
    const files: Record<string, string> = {
      ...defaultFiles,
      'src/demo.tsx': code,
    };
    if (code.includes("from '../time'")) {
      files['time.ts'] = timeTs as string;
    }
    if (code.includes("from '../useData'")) {
      files['useData.ts'] = useDataTs as string;
    }
    sdk.openProject(
      { files, template: 'node', title },
      { openFile: 'src/demo.tsx' },
    );
  }

  return (
    <ActionButton
      Icon={Icon}
      label="Open in StackBlitz"
      onClick={handleClick}
    />
  );
}
