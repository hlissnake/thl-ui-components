import { configure } from '@kadira/storybook';

const req = require.context('../', true, /^((?![\/]node_modules[\/]).*)story\.jsx$/)

function loadStories() {
  req.keys().forEach(req)
}

configure(loadStories, module);
