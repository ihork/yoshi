const fs = require('fs');
const path = require('path');
const glob = require('glob');
const replaceTemplates = require('./replaceTemplates');
const mkdirp = require('mkdirp');

module.exports = (
  {
    projectName,
    authorName,
    authorEmail,
    organization,
    projectType,
    transpiler,
  },
  workingDir,
) => {
  const templateName =
    projectType + (transpiler === 'typescript' ? '-typescript' : '');
  const templatePath = path.join(__dirname, '../templates', templateName);

  const filesPaths = glob.sync('**/*', {
    cwd: templatePath,
    nodir: true,
    dot: true,
  });

  const valuesMap = {
    projectName,
    authorName,
    authorEmail,
    organization,
  };
  const files = {};

  filesPaths.forEach(filePath => {
    const content = fs.readFileSync(path.join(templatePath, filePath), 'utf-8');
    files[filePath] = replaceTemplates(content, valuesMap);
  });

  for (const fileName in files) {
    const fullPath = path.join(workingDir, fileName);
    mkdirp.sync(path.dirname(fullPath));
    fs.writeFileSync(fullPath, files[fileName]);
  }
};
