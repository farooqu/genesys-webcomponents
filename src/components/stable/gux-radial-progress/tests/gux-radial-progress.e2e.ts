import { E2EElement, E2EPage } from '@stencil/core/testing';
import { newSparkE2EPage, a11yCheck } from '../../../../../tests/e2eTestUtils';

async function newNonrandomE2EPage({
  html
}: {
  html: string;
}): Promise<E2EPage> {
  const page = await newSparkE2EPage({
    html: `<div lang="en">${html}</div>`
  });

  await page.evaluateOnNewDocument(() => {
    Math.random = () => 0.5;
  });
  await page.waitForChanges();

  return page;
}

function getInternalProgressBar(radialProgressElement: E2EElement): Element {
  return radialProgressElement.shadowRoot.querySelector(
    'div[role="progressbar"]'
  );
}

describe('gux-radial-progress', () => {
  [
    '<gux-radial-progress lang="en" screenreader-text="Uploading file"></gux-radial-progress>',
    '<gux-radial-progress value="123" screenreader-text="Uploading file"></gux-radial-progress>',
    '<gux-radial-progress value="200" screenreader-text="Uploading file"></gux-radial-progress>',
    '<gux-radial-progress value="test" max="100" screenreader-text="Uploading file"></gux-radial-progress>',
    '<gux-radial-progress value="-123" max="100" screenreader-text="Uploading file"></gux-radial-progress>',
    '<gux-radial-progress value="200" max="100" screenreader-text="Uploading file"></gux-radial-progress>',
    '<gux-radial-progress value="10" max="test" screenreader-text="Uploading file"></gux-radial-progress>',
    '<gux-radial-progress value="0" screenreader-text="Uploading file"></gux-radial-progress>',
    '<gux-radial-progress value="10" screenreader-text="Uploading file"></gux-radial-progress>',
    '<gux-radial-progress value="100" screenreader-text="Uploading file"></gux-radial-progress>',
    '<gux-radial-progress value="10" max="100" screenreader-text="Uploading file"></gux-radial-progress>',
    '<gux-radial-progress value="10" max="10" screenreader-text="Uploading file"></gux-radial-progress>'
  ].forEach((html, index) => {
    it(`should display component as expected (${index + 1})`, async () => {
      const page = await newNonrandomE2EPage({ html });
      const element = await page.find('gux-radial-progress');
      await a11yCheck(page);

      expect(element.outerHTML).toMatchSnapshot();
    });
  });

  it('should render changes to the percentage data', async () => {
    const page = await newNonrandomE2EPage({
      html: '<gux-radial-progress value="0" screenreader-text="Uploading file"></gux-radial-progress>'
    });
    const element = await page.find('gux-radial-progress');

    expect(getInternalProgressBar(element).textContent).toEqual(`0%`);

    element.setProperty('value', 30);
    await page.waitForChanges();
    expect(getInternalProgressBar(element).textContent).toEqual(`30%`);

    element.setProperty('value', 100);
    await page.waitForChanges();
    expect(getInternalProgressBar(element).textContent).toEqual(`100%`);
  });

  it('should add an aria-label with the provided screenreader-text to the progressbar', async () => {
    const page = await newNonrandomE2EPage({
      html: '<gux-radial-progress value="0" screenreader-text="Uploading file"></gux-radial-progress>'
    });
    const element = await page.find('gux-radial-progress');
    await a11yCheck(page);

    expect(getInternalProgressBar(element).getAttribute('aria-label')).toEqual(
      'Uploading file'
    );
  });
});
