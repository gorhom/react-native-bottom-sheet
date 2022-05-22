import React, { useMemo } from 'react';
import { ShowcaseApp } from '@gorhom/showcase-template';
import { screens as defaultScreens } from './screens';
import { version, description } from '../../../package.json';

const author = {
  username: 'Mo Gorhom',
  url: 'https://gorhom.dev',
};

export const App = ({ screens: providedScreens }) => {
  const screens = useMemo(
    () => [...defaultScreens, ...providedScreens],
    [providedScreens]
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
