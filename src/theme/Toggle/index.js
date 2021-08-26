import React, { useCallback } from "react";
import clsx from "clsx";
import useThemeContext from "@theme/hooks/useThemeContext";
import useIsBrowser from "@docusaurus/useIsBrowser";
import styles from "./styles.module.css";

// Adapted from: https://codepen.io/aaroniker/pen/KGpXZo and https://github.com/narative/gatsby-theme-novela/blob/714b6209c5bd61b220370e8a7ad84c0b1407946a/%40narative/gatsby-theme-novela/src/components/Navigation/Navigation.Header.tsx

export default function (props) {
  // props
  const { "aria-label": ariaLabel } = props;

  // hooks
  const isBrowser = useIsBrowser();
  const { isDarkTheme, setDarkTheme, setLightTheme } = useThemeContext();

  // callbacks
  const handleToggleClick = useCallback(() => {
    if (isDarkTheme) {
      setLightTheme();
    } else {
      setDarkTheme();
    }
  }, [isDarkTheme, setDarkTheme, setLightTheme]);

  //render
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      title={ariaLabel}
      className={styles.toggleButton}
      onClick={handleToggleClick}
      disabled={!isBrowser}
    >
      <div className={clsx(styles.toggleIcon, "toggleIcon")} />
    </button>
  );
}
