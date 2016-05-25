import { configure } from '@kadira/storybook';

const req = require.context('../components/', true, /story\.jsx$/)

function loadStories() {
  req.keys().forEach(req)
}

configure(loadStories, module);
