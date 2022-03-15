import NewRelicBrowser from 'new-relic-browser';
import packageInfo from '../package.json';

const libraryPageAction = 'spark-library';
const componentPageAction = 'spark-component';
const actionPageAction = 'spark-action';

interface ComponentMetadata {
  // The variant of the component in use. e.g primary/secondary/tertiary for buttons, the specific icon for icons, etc
  variant?: string;
}

interface ActionMetadata {
  [key: string]: string | number;
}

let libVersionReported = false;
/**
 * Submits a component for tracking by NewRelic. Will also report the version of the library being
 * used the first time it is called.
 */
export function trackComponent(
  element: HTMLElement,
  metadata?: ComponentMetadata
) {
  const newrelic = window.newrelic;
  if (!newrelic) {
    return;
  }

  // if (element['s-hn']) {
  //   return;
  // }

  if (!libVersionReported) {
    reportLibraryVersion(newrelic);
    libVersionReported = true;
  }

  newrelic.addPageAction(componentPageAction, {
    ...metadata,
    component: element.tagName.toLowerCase(),
    version: packageInfo.version
  });
}

export function trackAction(
  element: HTMLElement,
  action: string,
  actionMetadata?: ActionMetadata
) {
  const newrelic = window.newrelic;
  if (!newrelic) {
    return;
  }

  newrelic.addPageAction(actionPageAction, {
    ...actionMetadata,
    action,
    component: element.tagName.toLowerCase()
  });
}

export function getVersionObject(packageInfoVersion: string) {
  const [major, minor, ...patch] = packageInfoVersion.split('.');

  return {
    fullVersion: `${major}.${minor}.${patch.join('.')}`,
    majorVersion: major,
    minorVersion: `${major}.${minor}`
  };
}

/**
 * Sends a library usage page action the first time it is called, does nothing afterward.
 */
function reportLibraryVersion(newrelic: typeof NewRelicBrowser) {
  const versionObject = getVersionObject(packageInfo.version);

  newrelic.addPageAction(libraryPageAction, versionObject);
}

// Get NewRelic types working
declare global {
  interface Window {
    newrelic?: typeof NewRelicBrowser;
  }
}
