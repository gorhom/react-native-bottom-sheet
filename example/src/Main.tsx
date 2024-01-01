import React from 'react';
import { ShowcaseApp } from '@gorhom/showcase-template';
import { screens } from './screens';
import { version, description } from '../../package.json';

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
