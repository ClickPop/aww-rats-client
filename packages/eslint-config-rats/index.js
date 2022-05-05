module.exports = {
  extends: ['next/core-web-vitals', 'prettier'],
  settings: {
    next: {
      rootDir: ['apps/*/', 'packages/*/'],
    },
  },
};
