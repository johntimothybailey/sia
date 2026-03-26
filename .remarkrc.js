const fs = require('fs');
const path = require('path');

const schema = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'docs/skill-schema.json'), 'utf8')
);

module.exports = {
  plugins: [
    'remark-frontmatter',
    ['remark-lint-frontmatter-schema', schema],
  ],
};
