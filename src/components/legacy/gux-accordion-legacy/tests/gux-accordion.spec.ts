import { newSpecPage } from '@stencil/core/testing';
import { GuxAccordionLegacy } from '../gux-accordion';

const components = [GuxAccordionLegacy];
const language = 'en';

describe('gux-accordion-legacy', () => {
  it('should render component as expected', async () => {
    const html = `
      <gux-accordion-legacy heading-level="2">
        <div slot="First Section">
          <span>I'm a span in a div.</span>
          <button>I'm the button.</button>
        </div>
        <p slot="Second Section">I'm a p.</p>
        <span slot="Third Section">I'm a span.</span>
        <span
          slot="Fourth Section has a really really long title to see what it looks like when the title overflows"
          >I'm a span.</span
        >
        <h1>I'm an h1, but i'm not a slot.</h1>
      </gux-accordion-legacy>
    `;
    const page = await newSpecPage({ components, html, language });

    expect(page.root).toMatchSnapshot();
  });
});
