import { newSparkE2EPage, a11yCheck } from '../../../../../tests/e2eTestUtils';

const axeExclusions = [];

describe('gux-switch', () => {
  const html = `
  <gux-switch lang-"en" layout="small" value="day">
    <gux-switch-item value="month">Month</gux-switch-item>
    <gux-switch-item value="week">Week</gux-switch-item>
    <gux-switch-item value="day">Day</gux-switch-item>
    <gux-switch-item value="hour" disabled>Hour</gux-switch-item>
    <gux-switch-item value="minute">Minute</gux-switch-item>
  </gux-switch>
`;
  describe('#render', () => {
    it(`should render as expected`, async () => {
      const page = await newSparkE2EPage({ html });
      const element = await page.find('gux-switch');
      await a11yCheck(page, axeExclusions);

      expect(element.outerHTML).toMatchSnapshot();
    });
  });

  describe('#interactions', () => {
    it(`should change value on gux-switch-item click`, async () => {
      const page = await newSparkE2EPage({ html });
      const element = await page.find('gux-switch');
      const guxSwitchItemMinute = await page.find(
        'gux-switch-item[value=minute]'
      );

      expect(await element.getProperty('value')).toBe('day');

      guxSwitchItemMinute.click();
      await page.waitForChanges();

      expect(await element.getProperty('value')).toBe(
        await guxSwitchItemMinute.getProperty('value')
      );
    });

    it(`should not change value on gux-switch-item click if it is disabled`, async () => {
      const page = await newSparkE2EPage({ html });
      const element = await page.find('gux-switch');
      const guxSwitchItemHour = await page.find('gux-switch-item[value=hour]');
      const currentValue = await element.getProperty('value');

      expect(currentValue).toBe('day');

      guxSwitchItemHour.click();
      await page.waitForChanges();

      expect(await element.getProperty('value')).toBe(currentValue);
    });

    it(`should emit a 'change' and 'input' event when a new item is selected`, async () => {
      const page = await newSparkE2EPage({ html });
      const element = await page.find('gux-switch');
      const guxSwitchItemMinute = await page.find(
        'gux-switch-item[value=minute]'
      );

      const spyOnInputEvent = await element.spyOnEvent('input');
      const spyOnChangeEvent = await element.spyOnEvent('change');

      guxSwitchItemMinute.click();
      await page.waitForChanges();

      expect(spyOnInputEvent.length).toBe(1);
      expect(spyOnChangeEvent.length).toBe(1);
    });

    it(`should not emit a 'change' or 'input' event when a disabled item is selected`, async () => {
      const page = await newSparkE2EPage({ html });
      const element = await page.find('gux-switch');
      const guxSwitchItemHour = await page.find('gux-switch-item[value=hour]');

      const spyOnInputEvent = await element.spyOnEvent('input');
      const spyOnChangeEvent = await element.spyOnEvent('change');

      guxSwitchItemHour.click();
      await page.waitForChanges();

      expect(spyOnInputEvent.length).toBe(0);
      expect(spyOnChangeEvent.length).toBe(0);
    });
  });

  describe('onSlotchange', () => {
    it(`should set selected item as expected`, async () => {
      const page = await newSparkE2EPage({
        html: `
        <gux-switch lang-"en" layout="small" value="month">
          <gux-switch-item value="week">Week</gux-switch-item>
          <gux-switch-item value="day">Day</gux-switch-item>
          <gux-switch-item value="hour" disabled>Hour</gux-switch-item>
          <gux-switch-item value="minute">Minute</gux-switch-item>
        </gux-switch>
      `
      });
      const element = await page.find('gux-switch');

      await page.evaluate(() => {
        const weekElement = document.querySelector(
          'gux-switch-item[value=week]'
        );

        const template = document.createElement('template');
        template.innerHTML =
          '<gux-switch-item value="month">Month</gux-switch-item>';
        const monthElement = template.content.firstChild as Element;

        weekElement.insertAdjacentElement('beforebegin', monthElement);
      });

      await page.waitForChanges();

      expect(element.outerHTML).toMatchSnapshot();
    });
  });
});
