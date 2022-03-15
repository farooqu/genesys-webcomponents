import { randomHTMLId } from '../../../utils/dom/random-html-id';
import { logError } from '../../../utils/error/log-error';
import setInputValue from '../../../utils/dom/set-input-value';

import { GuxFormFieldLabelPosition } from './gux-form-field.types';

export function clearInput(input: HTMLInputElement): void {
  setInputValue(input, '', true);
}

export function hasErrorSlot(root: HTMLElement): boolean {
  return Boolean(root.querySelector('[slot="error"]'));
}

export function hasContent(
  input: HTMLInputElement | HTMLTextAreaElement
): boolean {
  return Boolean(input.value);
}

export function getComputedLabelPosition(
  label: HTMLElement,
  labelPosition: GuxFormFieldLabelPosition
): GuxFormFieldLabelPosition {
  if (label) {
    if (['above', 'beside', 'screenreader'].includes(labelPosition)) {
      return labelPosition;
    } else if (label.offsetWidth > 1 && label.offsetWidth < 40) {
      return 'beside';
    } else {
      return 'above';
    }
  }
}

export function validateFormIds(
  root: HTMLElement,
  input: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
): void {
  if (hasLabelSlot(root)) {
    const label: HTMLLabelElement = root.querySelector('label[slot="label"]');
    const inputHasId = Boolean(input.hasAttribute('id'));
    const labelHasFor = Boolean(label.hasAttribute('for'));

    if (!inputHasId && labelHasFor) {
      logError(
        root.tagName.toLowerCase(),
        'A "for" attribute has been provided on the label but there is no corresponding id on the input. Either provide an id on the input or omit the "for" attribute from the label. If there is no input id and no "for" attribute provided, the component will automatically generate an id and link it to the "for" attribute.'
      );
    } else if (!inputHasId) {
      const defaultInputId = randomHTMLId('gux-form-field-input');
      input.setAttribute('id', defaultInputId);
      label.setAttribute('for', defaultInputId);
    } else if (inputHasId && !labelHasFor) {
      const forId = input.getAttribute('id');
      label.setAttribute('for', forId);
    } else if (
      inputHasId &&
      labelHasFor &&
      input.getAttribute('id') !== label.getAttribute('for')
    ) {
      logError(
        root.tagName.toLowerCase(),
        'The input id and label for attribute should match.'
      );
    }
  } else {
    logError(
      root.tagName.toLowerCase(),
      'A label is required for this component. If a visual label is not needed for this use case, please add localized text for a screenreader and set the label-position attribute to "screenreader" to visually hide the label.'
    );
  }

  if (hasErrorSlot(root)) {
    const error = root.querySelector('[slot="error"]');
    const errorId = randomHTMLId('gux-form-field-error');

    error.setAttribute('id', errorId);
    input.setAttribute('aria-describedby', errorId);
  } else if (
    input.getAttribute('aria-describedby') &&
    input.getAttribute('aria-describedby').startsWith('gux-form-field-error')
  ) {
    input.removeAttribute('aria-describedby');
  }
}

function hasLabelSlot(root: HTMLElement): boolean {
  return Boolean(root.querySelector('label[slot="label"]'));
}
