/**
 * Tree-out replica of the harness's shared client-bundle preset
 * (packages/client/tsdown.client.ts). The preset itself is not distributed as
 * an importable npm module, so an out-of-tree plugin re-declares the same
 * contract: the client half emits a closure-factory bundle registered through
 * window.__ModuleLoader__.load({ id, factory }), externals resolve through the
 * injected require (the shell's frozen module table), and every non-platform
 * dependency inlines.
 */
import type { UserConfig } from 'tsdown'

const ID = 'dsh-output-dock'

/**
 * Browser platform modules seeded into the shell's frozen module table
 * (packages/client/web/src/platform.ts) plus the runtime store exemption —
 * the exact CLIENT_EXTERNALS list. Keep in sync with the harness release the
 * plugin targets.
 */
const CLIENT_EXTERNALS = [
  'react', 'react/jsx-runtime', 'react-dom', 'react-dom/client',
  '@deepseek-ai/cordis',
  '@deepseek-ai/dsh-client-ui-slots',
  '@deepseek-ai/dsh-client-web-react',
  '@deepseek-ai/dsh-client-ui-primitives',
  '@deepseek-ai/dsh-client-ui-attachment',
  '@deepseek-ai/dsh-client-schema-form',
  '@deepseek-ai/dsh-client-runtime/client',
]

const nodeHalf: UserConfig = {
  name: ID,
  entry: ['src/index.ts'],
  outDir: 'lib',
  format: ['esm'],
  platform: 'node',
  target: 'es2024',
  fixedExtension: false,
  dts: false,
  clean: false,
}

const clientHalf: UserConfig = {
  name: `${ID}/client`,
  entry: { client: 'src/client/index.ts' },
  outDir: 'lib',
  format: ['cjs'],
  platform: 'browser',
  dts: false,
  sourcemap: true,
  clean: false,
  external: [...CLIENT_EXTERNALS],
  // zustand/immer-style probes need the same substitutions the shell's Vite
  // build applies on the seed path.
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV ?? 'production'),
    'import.meta.env.MODE': JSON.stringify(process.env.NODE_ENV ?? 'production'),
    'import.meta.env': JSON.stringify({ MODE: process.env.NODE_ENV ?? 'production' }),
  },
  // Externals win; everything else (marked, dompurify, own code) inlines — a
  // require() the frozen module table cannot answer is a runtime throw.
  noExternal: (id: string) => (CLIENT_EXTERNALS.includes(id) ? undefined : true),
  plugins: [
    {
      // Bundle purity gate, mirroring the harness preset: platform modules
      // stay external, everything else under @deepseek-ai/* must be
      // type-only (erased before this gate runs) or a build error.
      name: 'dsh-output-dock-purity',
      resolveId(source: string) {
        if (!source.startsWith('@deepseek-ai/')) return null
        if (CLIENT_EXTERNALS.includes(source)) return null
        throw new Error(
          `client bundle purity: "${source}" is not a platform module — `
          + 'cross-plugin value imports are forbidden; collaborate through cordis services '
          + '(type-only imports are erased and never reach this gate)',
        )
      },
    },
  ],
  outputOptions: {
    entryFileNames: 'client.js',
    banner: `window.__ModuleLoader__.load({ id: ${JSON.stringify(ID)}, factory: (require) => {`,
    footer: 'return module.exports; } });',
    intro: 'var module = { exports: {} }; var exports = module.exports;',
  },
}

export default [nodeHalf, clientHalf]
