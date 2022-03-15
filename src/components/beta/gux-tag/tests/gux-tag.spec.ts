import { newSpecPage } from '@stencil/core/testing';
import { GuxTag } from '../gux-tag';

const components = [GuxTag];
const language = 'en';

describe('gux-tag-beta', () => {
  describe('#render', () => {
    [
      '<gux-tag-beta>default</gux-tag-beta>',
      '<gux-tag-beta color="default">default (explicit)</gux-tag-beta>',
      '<gux-tag-beta color="navy">navy</gux-tag-beta>',
      '<gux-tag-beta icon="bolt" color="navy">navy</gux-tag-beta>',
      '<gux-tag-beta icon="bolt" color="navy" value="3" removable>navy</gux-tag-beta>',
      '<gux-tag-beta icon="bolt" color="navy" value="3" removable disabled>navy</gux-tag-beta>'
    ].forEach((html, index) => {
      it(`should render component as expected (${index + 1})`, async () => {
        const page = await newSpecPage({ components, html, language });

        expect(page.root).toMatchSnapshot();
      });
    });
  });

  describe('delete', () => {
    describe('click', () => {
      it('should not have a delete button if tag is not removable', async () => {
        const html = `<gux-tag-beta icon="bolt" color="navy" value="3">navy</gux-tag-beta>`;
        const page = await newSpecPage({ components, html, language });
        const element = page.root as HTMLElement;
        const deleteButton: HTMLButtonElement =
          element.shadowRoot.querySelector('.gux-tag-remove-button');

        expect(deleteButton).toBeNull();
      });

      it('should emit guxdelete if tag is removable and not disabled', async () => {
        const html = `<gux-tag-beta icon="bolt" color="navy" value="3" removable>navy</gux-tag-beta>`;
        const page = await newSpecPage({ components, html, language });
        const element = page.root as HTMLElement;
        const deleteButton: HTMLButtonElement =
          element.shadowRoot.querySelector('.gux-tag-remove-button');
        const guxdeleteSpy = jest.fn();

        page.win.addEventListener('guxdelete', guxdeleteSpy);

        deleteButton.click();
        await page.waitForChanges();

        expect(guxdeleteSpy).toHaveBeenCalledWith(
          expect.objectContaining({ detail: '3' })
        );
      });

      it('should not emit guxdelete if tag is removable and disabled', async () => {
        const html = `<gux-tag-beta icon="bolt" color="navy" value="3" removable disabled>navy</gux-tag-beta>`;
        const page = await newSpecPage({ components, html, language });
        const element = page.root as HTMLElement;
        const deleteButton: HTMLButtonElement =
          element.shadowRoot.querySelector('.gux-tag-remove-button');
        const guxdeleteSpy = jest.fn();

        page.win.addEventListener('guxdelete', guxdeleteSpy);

        deleteButton.click();
        await page.waitForChanges();

        expect(guxdeleteSpy).not.toHaveBeenCalled();
      });
    });

    describe('keypress', () => {
      it('should emit guxdelete if tag is focused and removable and "Delete" is pressed', async () => {
        const html = `<gux-tag-beta icon="bolt" color="navy" value="3" removable>navy</gux-tag-beta>`;
        const page = await newSpecPage({ components, html, language });
        const element = page.root as HTMLElement;
        const guxdeleteSpy = jest.fn();

        page.win.addEventListener('guxdelete', guxdeleteSpy);

        element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Delete' }));
        await page.waitForChanges();

        expect(guxdeleteSpy).toHaveBeenCalledWith(
          expect.objectContaining({ detail: '3' })
        );
      });

      it('should emit guxdelete if tag is focused and removable and "Backspace" is pressed', async () => {
        const html = `<gux-tag-beta icon="bolt" color="navy" value="3" removable>navy</gux-tag-beta>`;
        const page = await newSpecPage({ components, html, language });
        const element = page.root as HTMLElement;
        const guxdeleteSpy = jest.fn();

        page.win.addEventListener('guxdelete', guxdeleteSpy);

        element.dispatchEvent(
          new KeyboardEvent('keydown', { key: 'Backspace' })
        );
        await page.waitForChanges();

        expect(guxdeleteSpy).toHaveBeenCalledWith(
          expect.objectContaining({ detail: '3' })
        );
      });

      it('should not emit guxdelete if tag is focused and not removable and "Delete" is pressed', async () => {
        const html = `<gux-tag-beta icon="bolt" color="navy" value="3">navy</gux-tag-beta>`;
        const page = await newSpecPage({ components, html, language });
        const element = page.root as HTMLElement;
        const guxdeleteSpy = jest.fn();

        page.win.addEventListener('guxdelete', guxdeleteSpy);

        element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Delete' }));
        await page.waitForChanges();

        expect(guxdeleteSpy).not.toHaveBeenCalled();
      });

      it('should not emit guxdelete if tag is focused and not removable and "Backspace" is pressed', async () => {
        const html = `<gux-tag-beta icon="bolt" color="navy" value="3">navy</gux-tag-beta>`;
        const page = await newSpecPage({ components, html, language });
        const element = page.root as HTMLElement;
        const guxdeleteSpy = jest.fn();

        page.win.addEventListener('guxdelete', guxdeleteSpy);

        element.dispatchEvent(
          new KeyboardEvent('keydown', { key: 'Backspace' })
        );
        await page.waitForChanges();

        expect(guxdeleteSpy).not.toHaveBeenCalled();
      });
    });
  });
});
