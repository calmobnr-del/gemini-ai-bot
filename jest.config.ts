const { getJestProjectsAsync } = require('@nx/jest');

/** @type {import('jest').Config} */
module.exports = async () => ({
  projects: await getJestProjectsAsync(),
});
