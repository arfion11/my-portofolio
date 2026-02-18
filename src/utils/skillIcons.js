/**
 * Mapping of skill/tool names to their CDN-hosted icon URLs.
 * Uses devicon (jsdelivr) and Simple Icons CDN for lightweight SVG icons.
 */

const DEVICON = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons';
const SIMPLE = 'https://cdn.simpleicons.org';

const skillIcons = {
  // Automation Testing
  Cypress: `${DEVICON}/cypressio/cypressio-original.svg`,
  Playwright: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/playwright.svg',
  Appium: `${SIMPLE}/appium/662D91`,
  Selenium: `${DEVICON}/selenium/selenium-original.svg`,

  // API Testing
  Postman: `${SIMPLE}/postman/FF6C37`,
  Swagger: `${DEVICON}/swagger/swagger-original.svg`,

  // Performance Testing
  Locust: 'https://locust.io/static/img/logo.png',
  Grafana: `${DEVICON}/grafana/grafana-original.svg`,

  // Tools & Bug Tracking
  Jira: `${DEVICON}/jira/jira-original.svg`,
  Notion: `${DEVICON}/notion/notion-original.svg`,
  Trello: `${DEVICON}/trello/trello-original.svg`,
  Confluence: `${DEVICON}/confluence/confluence-original.svg`,
  Git: `${DEVICON}/git/git-original.svg`,
  GitHub: `${DEVICON}/github/github-original.svg`,
  Figma: `${DEVICON}/figma/figma-original.svg`,
  Bitbucket: `${DEVICON}/bitbucket/bitbucket-original.svg`,
  Jenkins: `${DEVICON}/jenkins/jenkins-original.svg`,

  // Programming Languages
  JavaScript: `${DEVICON}/javascript/javascript-original.svg`,
  TypeScript: `${DEVICON}/typescript/typescript-original.svg`,
  Kotlin: `${DEVICON}/kotlin/kotlin-original.svg`,
  Python: `${DEVICON}/python/python-original.svg`,
  Java: `${DEVICON}/java/java-original.svg`,
  PHP: `${DEVICON}/php/php-original.svg`,
  'C#': `${DEVICON}/csharp/csharp-original.svg`,
  HTML: `${DEVICON}/html5/html5-original.svg`,
  CSS: `${DEVICON}/css3/css3-original.svg`,

  // Frameworks
  Laravel: `${DEVICON}/laravel/laravel-original.svg`,
  'Node.js': `${DEVICON}/nodejs/nodejs-original.svg`,
  Android: `${DEVICON}/android/android-original.svg`,
  Flutter: `${DEVICON}/flutter/flutter-original.svg`,
  Unity: `${DEVICON}/unity/unity-original.svg`,

  // Database
  MySQL: `${DEVICON}/mysql/mysql-original.svg`,
  MongoDB: `${DEVICON}/mongodb/mongodb-original.svg`,
  PostgreSQL: `${DEVICON}/postgresql/postgresql-original.svg`,
};

export default skillIcons;
