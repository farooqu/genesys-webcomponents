import { E2EPage, newE2EPage } from '@stencil/core/testing';
import {
  newSparkE2EPage,
  a11yCheck
} from '../../../../../../../tests/e2eTestUtils';

const axeExclusions = [];

async function newNonrandomE2EPage({
  html
}: {
  html: string;
}): Promise<E2EPage> {
  const page = await newE2EPage();

  await page.evaluateOnNewDocument(() => {
    Math.random = () => 0.5;
  });
  await page.setContent(html);
  await page.waitForChanges();

  return page;
}

describe('gux-form-field-checkbox-beta', () => {
  describe('#render', () => {
    [
      `
        <gux-form-field-checkbox-beta>
          <input slot="input" type="checkbox" name="food-1[]" value="pizza"/>
          <label slot="label">Pizza</label>
        </gux-form-field-checkbox-beta>
      `,
      `
        <gux-form-field-checkbox-beta>
          <input slot="input" type="checkbox" name="food-1[]" value="pizza" disabled/>
          <label slot="label">Pizza</label>
        </gux-form-field-checkbox-beta>
      `,
      `
        <gux-form-field-checkbox-beta>
          <input slot="input" type="checkbox" name="food-1[]" value="pizza"/>
          <label slot="label">Pizza</label>
          <span slot="error">This is an error message</span>
        </gux-form-field-checkbox-beta>
      `,
      `
        <gux-form-field-checkbox-beta>
          <input slot="input" type="checkbox" name="food-1[]" value="pizza" checked/>
          <label slot="label">Pizza</label>
        </gux-form-field-checkbox-beta>
      `,
      `
        <gux-form-field-checkbox-beta>
          <input slot="input" type="checkbox" name="food-1[]" value="pizza"/>
          <label slot="label">Pizza</label>
          <span slot="error">Error message</span>
        </gux-form-field-checkbox-beta>
      `
    ].forEach((html, index) => {
      it(`should render component as expected (${index + 1})`, async () => {
        const page = await newNonrandomE2EPage({ html });
        const element = await page.find('gux-form-field-checkbox-beta');
        const elementShadowDom = await element.find(
          'pierce/.gux-form-field-container'
        );

        expect(element.outerHTML).toMatchSnapshot();
        expect(elementShadowDom).toMatchSnapshot();
      });

      it(`should be accessible (${index + 1})`, async () => {
        const page = await newSparkE2EPage({ html });

        await a11yCheck(page, axeExclusions);
      });
    });
  });

  it('switches between states when clicked', async () => {
    const page = await newSparkE2EPage({
      html: `
        <gux-form-field-checkbox-beta>
          <input slot="input" type="checkbox" name="food-1[]" value="pizza"/>
          <label slot="label">Pizza</label>
        </gux-form-field-checkbox-beta>
      `
    });

    const element = await page.find('gux-form-field-checkbox-beta');
    const label = await element.find('label');
    const input = await element.find('input');

    await a11yCheck(page, axeExclusions, 'Before checking checkbox');
    await label.click();
    await page.waitForChanges();
    expect(await input.getProperty('checked')).toBe(true);

    await a11yCheck(page, axeExclusions, 'After checking checkbox');
    await label.click();
    await page.waitForChanges();
    expect(await input.getProperty('checked')).toBe(false);

    await label.click();
    await page.waitForChanges();
    expect(await input.getProperty('checked')).toBe(true);
  });
});
