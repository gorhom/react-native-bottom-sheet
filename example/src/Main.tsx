import { ShowcaseApp } from '@gorhom/showcase-template';
import React from 'react';
import { description, version } from '../../package.json';
import { screens } from './screens';

const author = {
  username: 'Mo Gorhom',
  url: 'https://gorhom.dev',
};

export default () => (
  <ShowcaseApp
    name="Bottom Sheet"
    description={description}
    version={version}
    author={author}
    data={screens}
  />
);
