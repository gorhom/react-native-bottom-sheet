import React, { useCallback } from 'react';
import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './styles.module.css';

// Adapted from: https://codepen.io/aaroniker/pen/KGpXZo and https://github.com/narative/gatsby-theme-novela/blob/714b6209c5bd61b220370e8a7ad84c0b1407946a/%40narative/gatsby-theme-novela/src/components/Navigation/Navigation.Header.tsx

export default function (props) {
  // props
  const { checked, 'aria-label': ariaLabel, onChange } = props;

  // hooks
  const { isClient } = useDocusaurusContext();

  // callbacks
  const handleToggleClick = useCallback(() => {
    onChange({ target: { checked: !checked } });
  }, [checked, onChange]);

  //render
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      title={ariaLabel}
      className={styles.toggleButton}
      onClick={handleToggleClick}
      disabled={!isClient}
    >
      <div className={clsx(styles.toggleIcon, 'toggleIcon')} />
    </button>
  );
}
