import { getAssetPath } from '@stencil/core';

import { iconNameMap } from './icon-name-map';
import { oldIconNames } from './old-icon-names';

const svgHTMLCache: Map<string, Promise<string>> = new Map();

async function fetchIcon(iconName: string): Promise<string> {
  const iconResponse = await fetch(getAssetPath(`./icons/${iconName}.svg`));

  if (iconResponse.status === 200) {
    return iconResponse.text();
  }

  console.error(
    `[gux-icon] fetching failed for icon "${iconName}" with status "${iconResponse.statusText} (${iconResponse.status})".`
  );

  const unknownIconResponse = await fetch(getAssetPath(`./icons/unknown.svg`));

  if (unknownIconResponse.status === 200) {
    return unknownIconResponse.text();
  }

  throw new Error(
    `[gux-icon] fetching failed for icon "${this.iconName}" and fallback unknown icon".`
  );
}

function iconinfoToId(
  iconName: string,
  decorative: boolean,
  screenreaderText: string
): string {
  return `${iconName.replace('/', '-')}-${decorative}-${screenreaderText}`;
}

export function getRootIconName(iconName: string): string {
  if (iconNameMap[iconName]) {
    return iconNameMap[iconName];
  }

  if (oldIconNames.includes(iconName)) {
    return `old/${iconName}`;
  }

  return iconName;
}

export function getSvgHtml(
  iconName: string,
  decorative: boolean,
  screenreaderText: string
): Promise<string> {
  const id = iconinfoToId(iconName, decorative, screenreaderText);
  const cachedSvgElement = svgHTMLCache.get(id);

  if (cachedSvgElement) {
    return cachedSvgElement;
  }

  const svgHtml = fetchIcon(iconName)
    .then(svgText => {
      const svgElement = new DOMParser().parseFromString(
        svgText,
        'image/svg+xml'
      ).firstChild as SVGElement;
      if (decorative) {
        svgElement.setAttribute('aria-hidden', String(decorative));
      }

      if (screenreaderText) {
        svgElement.setAttribute('aria-label', screenreaderText);
      }

      return svgElement.outerHTML;
    })
    .catch(err => {
      setTimeout(() => {
        throw err;
      }, 0);
      return null;
    });

  svgHTMLCache.set(id, svgHtml);

  return svgHtml;
}
