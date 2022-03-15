import { newSparkE2EPage, a11yCheck } from '../../../../../tests/e2eTestUtils';

describe('gux-button-slot-beta', () => {
  describe('#render', () => {
    [
      {
        description: 'should render default button',
        html: '<gux-button-slot-beta><button type="button"accent="primary">Button</button></gux-button-slot-beta>'
      },
      {
        description: 'should render primary button',
        html: '<gux-button-slot-beta accent="primary"><button type="button"accent="primary">Button</button></gux-button-slot-beta>'
      },
      {
        description: 'should render secondary button',
        html: '<gux-button-slot-beta accent="secondary"><button type="button"accent="primary">Button</button></gux-button-slot-beta>'
      },
      {
        description: 'should render tertiary button',
        html: '<gux-button-slot-beta accent="tertiary"><button type="button"accent="primary">Button</button></gux-button-slot-beta>'
      },
      {
        description: 'should render invalid button',
        html: '<gux-button-slot-beta accent="invalid"><button type="button"accent="primary">Button</button></gux-button-slot-beta>'
      },
      {
        description: 'should render disabled default button',
        html: '<gux-button-slot-beta><button type="button"accent="primary" disabled>Button</button></gux-button-slot-beta>'
      },
      {
        description: 'should render disabled primary button',
        html: '<gux-button-slot-beta accent="primary"><button type="button"accent="primary" disabled>Button</button></gux-button-slot-beta>'
      },
      {
        description: 'should render disabled secondary button',
        html: '<gux-button-slot-beta accent="secondary"><button type="button"accent="primary" disabled>Button</button></gux-button-slot-beta>'
      },
      {
        description: 'should render disabled tertiary button',
        html: '<gux-button-slot-beta accent="tertiary"><button type="button"accent="primary" disabled>Button</button></gux-button-slot-beta>'
      },
      {
        description: 'should render button with invalid accent',
        html: '<gux-button-slot-beta accent="invalid"><button type="button"accent="primary">Button</button></gux-button-slot-beta>'
      },
      {
        description: 'should render default input[type=button]',
        html: '<gux-button-slot-beta><input type="button"accent="primary" value="Button"/></gux-button-slot-beta>'
      },
      {
        description: 'should render primary input[type=button]',
        html: '<gux-button-slot-beta accent="primary"><input type="button"accent="primary" value="Button"/></gux-button-slot-beta>'
      },
      {
        description: 'should render secondary input[type=button]',
        html: '<gux-button-slot-beta accent="secondary"><input type="button"accent="primary" value="Button"/></gux-button-slot-beta>'
      },
      {
        description: 'should render tertiary input[type=button]',
        html: '<gux-button-slot-beta accent="tertiary"><input type="button"accent="primary" value="Button"/></gux-button-slot-beta>'
      },
      {
        description: 'should render invalid input[type=button]',
        html: '<gux-button-slot-beta accent="invalid"><input type="button"accent="primary" value="Button"/></gux-button-slot-beta>'
      },
      {
        description: 'should render disabled default input[type=button]',
        html: '<gux-button-slot-beta><input type="button"accent="primary" disabled value="Button"/></gux-button-slot-beta>'
      },
      {
        description: 'should render disabled primary input[type=button]',
        html: '<gux-button-slot-beta accent="primary"><input type="button"accent="primary" disabled value="Button"/></gux-button-slot-beta>'
      },
      {
        description: 'should render disabled secondary input[type=button]',
        html: '<gux-button-slot-beta accent="secondary"><input type="button"accent="primary" disabled value="Button"/></gux-button-slot-beta>'
      },
      {
        description: 'should render disabled tertiary input[type=button]',
        html: '<gux-button-slot-beta accent="tertiary"><input type="button"accent="primary" disabled value="Button"/></gux-button-slot-beta>'
      },
      {
        description: 'should render input[type=button] with invalid accent',
        html: '<gux-button-slot-beta accent="invalid"><input type="button"accent="primary" value="Button"/></gux-button-slot-beta>'
      },
      {
        description: 'should render default input[type=submit]',
        html: '<gux-button-slot-beta><input type="submit"accent="primary" value="Button"/></gux-button-slot-beta>'
      },
      {
        description: 'should render primary input[type=submit]',
        html: '<gux-button-slot-beta accent="primary"><input type="submit"accent="primary" value="Button"/></gux-button-slot-beta>'
      },
      {
        description: 'should render secondary input[type=submit]',
        html: '<gux-button-slot-beta accent="secondary"><input type="submit"accent="primary" value="Button"/></gux-button-slot-beta>'
      },
      {
        description: 'should render tertiary input[type=submit]',
        html: '<gux-button-slot-beta accent="tertiary"><input type="submit"accent="primary" value="Button"/></gux-button-slot-beta>'
      },
      {
        description: 'should render invalid input[type=submit]',
        html: '<gux-button-slot-beta accent="invalid"><input type="submit"accent="primary" value="Button"/></gux-button-slot-beta>'
      },
      {
        description: 'should render disabled default input[type=submit]',
        html: '<gux-button-slot-beta><input type="submit"accent="primary" disabled value="Button"/></gux-button-slot-beta>'
      },
      {
        description: 'should render disabled primary input[type=submit]',
        html: '<gux-button-slot-beta accent="primary"><input type="submit"accent="primary" disabled value="Button"/></gux-button-slot-beta>'
      },
      {
        description: 'should render disabled secondary input[type=submit]',
        html: '<gux-button-slot-beta accent="secondary"><input type="submit"accent="primary" disabled value="Button"/></gux-button-slot-beta>'
      },
      {
        description: 'should render disabled tertiary input[type=submit]',
        html: '<gux-button-slot-beta accent="tertiary"><input type="submit"accent="primary" disabled value="Button"/></gux-button-slot-beta>'
      },
      {
        description: 'should render input[type=submit] with invalid accent',
        html: '<gux-button-slot-beta accent="invalid"><input type="submit"accent="primary" value="Button"/></gux-button-slot-beta>'
      }
    ].forEach(({ description, html }) => {
      it(description, async () => {
        const page = await newSparkE2EPage({ html });
        const element = await page.find('gux-button-slot-beta');

        await a11yCheck(page);
        expect(element.outerHTML).toMatchSnapshot();
      });
    });
  });
});
