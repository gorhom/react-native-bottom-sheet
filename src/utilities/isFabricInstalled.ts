/**
 * Checks if the Fabric renderer is installed in the current environment.
 *
 * @returns {boolean} `true` if Fabric is installed, otherwise `false`.
 */
export function isFabricInstalled() {
  // @ts-ignore
  return global?.nativeFabricUIManager != null;
}
