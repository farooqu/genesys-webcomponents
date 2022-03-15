import { E2EElement } from '@stencil/core/testing';
import { newSparkE2EPage, a11yCheck } from '../../../../../tests/e2eTestUtils';

function getInternalProgressBar(radialLoadingElement: E2EElement): Element {
  return radialLoadingElement.shadowRoot.querySelector(
    'div[role="progressbar"]'
  );
}

describe('gux-radial-loading', () => {
  [
    '<gux-radial-loading lang="en"></gux-radial-loading>',
    '<gux-radial-loading lang="en" context="modal"></gux-radial-loading>',
    '<gux-radial-loading lang="en" context="input"></gux-radial-loading>',
    '<gux-radial-loading lang="en" context="full-page"></gux-radial-loading>'
  ].forEach((html, index) => {
    it(`should display component as expected (${index + 1})`, async () => {
      const page = await newSparkE2EPage({ html });
      const element = await page.find('gux-radial-loading');

      await a11yCheck(page);
      expect(element.innerHTML).toMatchSnapshot();
    });
  });

  it('should add an aria-label with the provided screenreader-text to the progressbar', async () => {
    const html =
      '<gux-radial-loading lang="en" screenreader-text="Loading Content"></gux-radial-loading>';
    const page = await newSparkE2EPage({ html });
    const element = await page.find('gux-radial-loading');
    await a11yCheck(page);

    expect(getInternalProgressBar(element).getAttribute('aria-label')).toEqual(
      'Loading Content'
    );
  });

  it('should add the default aria-label text if no screenreader-text is provided', async () => {
    const html = '<gux-radial-loading lang="en"></gux-radial-loading>';
    const page = await newSparkE2EPage({ html });
    const element = await page.find('gux-radial-loading');
    await a11yCheck(page);

    expect(getInternalProgressBar(element).getAttribute('aria-label')).toEqual(
      'Loading'
    );
  });
});
