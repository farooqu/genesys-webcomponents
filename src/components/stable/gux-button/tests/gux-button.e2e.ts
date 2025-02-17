import { newSparkE2EPage, a11yCheck } from '../../../../../tests/e2eTestUtils';

const axeExclusions = [];

describe('gux-button', () => {
  describe('#render', () => {
    [
      {
        clickable: true,
        description: 'should render default button',
        html: '<gux-button gux-title="default">Button</gux-button>'
      },
      {
        clickable: true,
        description: 'should render primary button',
        html: '<gux-button gux-title="Primary" accent="primary">Button</gux-button>'
      },
      {
        clickable: true,
        description: 'should render secondary button',
        html: '<gux-button gux-title="Secondary" accent="secondary">Button</gux-button>'
      },
      {
        clickable: true,
        description: 'should render tertiary button',
        html: '<gux-button gux-title="Tertiary" accent="tertiary">Button</gux-button>'
      },
      {
        clickable: true,
        description: 'should render invalid button',
        html: '<gux-button gux-title="Invalid accent" accent="invalid">Invalid accent</gux-button>'
      },
      {
        clickable: false,
        description: 'should render disabled default button',
        html: '<gux-button gux-title="default" disabled>Button</gux-button>'
      },
      {
        clickable: false,
        description: 'should render disabled primary button',
        html: '<gux-button gux-title="default" accent="primary" disabled>Button</gux-button>'
      },
      {
        clickable: false,
        description: 'should render disabled secondary button',
        html: '<gux-button gux-title="default" accent="secondary" disabled>Button</gux-button>'
      },
      {
        clickable: false,
        description: 'should render disabled tertiary button',
        html: '<gux-button gux-title="Tertiary" accent="tertiary" disabled>Button</gux-button>'
      },
      {
        clickable: false,
        description: 'should render disabled invalid button',
        html: '<gux-button gux-title="Invalid accent" accent="invalid" disabled>Invalid accent</gux-button>'
      }
    ].forEach(({ description, html, clickable }) => {
      it(description, async () => {
        const page = await newSparkE2EPage({ html });
        const element = await page.find('gux-button');
        const onClickSpy = await element.spyOnEvent('click');
        const expectOnclickEvents = clickable ? 1 : 0;

        await a11yCheck(page, axeExclusions);
        expect(element.outerHTML).toMatchSnapshot();

        await element.click();
        await page.waitForChanges();

        expect(onClickSpy).toHaveReceivedEventTimes(expectOnclickEvents);
      });
    });
  });

  describe('click', () => {
    it('should fire a click event when an enabled button slot content is clicked', async () => {
      const html =
        '<gux-button gux-title="default"><span>Span</span></gux-button>';
      const page = await newSparkE2EPage({ html });
      const element = await page.find('gux-button');
      const onClickSpy = await element.spyOnEvent('click');
      const span = await page.find('span');

      span.click();
      await page.waitForChanges();

      expect(onClickSpy).toHaveReceivedEventTimes(1);
    });

    it('should not fire a click event when a disabled button slot content is clicked', async () => {
      const html =
        '<gux-button gux-title="default" disabled><span>Span</span></gux-button>';
      const page = await newSparkE2EPage({ html });
      const element = await page.find('gux-button');
      const onClickSpy = await element.spyOnEvent('click');
      const span = await page.find('span');

      span.click();
      await page.waitForChanges();

      expect(onClickSpy).toHaveReceivedEventTimes(0);
    });
  });
  describe('focus', () => {
    it('should be programmatically focusable', async () => {
      const html = '<gux-button>Button</gux-button>';
      const page = await newSparkE2EPage({ html });
      const element = await page.find('gux-button');

      await element.callMethod('focusElement');
      const focusedElement = await page.evaluateHandle(
        () => document.activeElement.nodeName
      );
      expect(await focusedElement.jsonValue()).toBe('BUTTON');
    });
  });
});
