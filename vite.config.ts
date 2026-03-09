import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const isGitHubPagesBuild = process.env.GITHUB_ACTIONS === 'true'
const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? 'controlpaneldemo'

// https://vite.dev/config/
export default defineConfig({
  base: isGitHubPagesBuild ? `/${repositoryName}/` : '/',
  plugins: [react()],
})
