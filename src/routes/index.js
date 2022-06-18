/* eslint-disable import/no-dynamic-require */

const { readdirSync } = require('fs');

const routes = [];

readdirSync(__dirname)
  .filter((file) => (file !== 'index.js'))
  .forEach((file) => {
    routes.push(...require(`./${file}`));
  });

module.exports = routes;
