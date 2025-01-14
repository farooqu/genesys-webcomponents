import { newSparkE2EPage, a11yCheck } from '../../../../../tests/e2eTestUtils';

const axeExclusions = [];

describe('gux-dropdown', () => {
  it('renders', async () => {
    const page = await newSparkE2EPage({
      html: `<gux-dropdown lang="en"></gux-dropdown>`
    });
    const element = await page.find('gux-dropdown');
    expect(element).toHaveClass('hydrated');
  });

  it('opens drop down on click', async () => {
    const page = await newSparkE2EPage({
      html: `
      <gux-dropdown lang="en" placeholder="Select..." filterable=true>
        <gux-option value="en-US">American English</gux-option>
        <gux-option value="es">Latin American Spanish</gux-option>
        <gux-option value="es-ES">European Spanish</gux-option>
        <gux-option value="en-UK">UK English</gux-option>
        <gux-option value="fr-CA" text= "Canadian French">American French</gux-option>
        <gux-option value="fr" text="European French"></gux-option>
        <gux-option>Dutch</gux-option>
      </gux-dropdown>
    `
    });
    await page.waitForChanges();
    await a11yCheck(page, axeExclusions, 'before opening dropdown');
    const element = await page.find('gux-dropdown');
    const inputElm = await element.find('gux-input-text-like');
    inputElm.click();
    await page.waitForChanges();
    await a11yCheck(page, axeExclusions, 'after opening dropdown');

    const dropMenu = await element.find('.gux-dropdown');
    expect(dropMenu.className.split(' ')).toContain('gux-active');
  });

  it('selects an item when an option is clicked', async () => {
    const page = await newSparkE2EPage({
      html: `<gux-dropdown lang="en" placeholder="Select..." filterable=true>
        <gux-option value="en-US">American English</gux-option>
        <gux-option value="es">Latin American Spanish</gux-option>
        <gux-option value="es-ES">European Spanish</gux-option>
        <gux-option value="en-UK">UK English</gux-option>
        <gux-option value="fr-CA" text= "Canadian French">American French</gux-option>
        <gux-option value="fr" text="European French"></gux-option>
        <gux-option>Dutch</gux-option>
      </gux-dropdown>
      `
    });
    await page.waitForChanges();
    const element = await page.find('gux-dropdown');
    const changeSpy = await element.spyOnEvent('change');

    const inputElm = await element.find('gux-input-text-like');
    inputElm.click();
    await page.waitForChanges();

    let dropMenu = await element.find('.gux-dropdown');
    const enElm = await dropMenu.find('gux-option');
    enElm.click();
    await page.waitForChanges();
    dropMenu = await element.find('.gux-dropdown');

    expect(changeSpy).toHaveReceivedEventDetail('en-US');
    expect(dropMenu.className.split(' ')).not.toContain('gux-active');
  });
});
