import React, { useMemo } from 'react';
import { ShowcaseApp } from '@gorhom/showcase-template';
import { screens } from './screens';
import { version, description } from '../../package.json';

const App = () => {
  // variables
  const author = useMemo(
    () => ({
      username: 'Mo Gorhom',
      url: 'https://gorhom.dev',
    }),
    []
  );

  return (
    <ShowcaseApp
      name="Bottom Sheet"
      description={description}
      version={version}
      author={author}
      data={screens}
    />
  );
};

export default App;
