import {
  canShowPercentageState,
  getPercentageString
} from '../gux-radial-progress.service';

describe('gux-radial-progress.service', () => {
  describe('#canShowPercentageState', () => {
    [
      { value: 0, max: 0, expectResult: false },
      { value: 0, max: 10, expectResult: true },
      { value: 10, max: 0, expectResult: false },
      { value: 1, max: 10, expectResult: true },
      { value: 10, max: 10, expectResult: true },
      { value: 10, max: 1, expectResult: false },
      { value: NaN, max: 10, expectResult: false },
      { value: 10, max: NaN, expectResult: false },
      { value: -1, max: 10, expectResult: false },
      { value: 1, max: -10, expectResult: false }
    ].forEach(({ value, max, expectResult }, index) => {
      it(`should render component as expected (${index + 1})`, async () => {
        const result = canShowPercentageState(value, max);

        expect(result).toBe(expectResult);
      });
    });
  });

  describe('#getPercentageString', () => {
    [
      { value: 0, max: 10, scale: 0, expectResult: '0%' },
      { value: 1, max: 10, scale: 0, expectResult: '10%' },
      { value: 1.5, max: 10, scale: 0, expectResult: '15%' },
      { value: 1.55, max: 10, scale: 0, expectResult: '16%' },
      { value: 1.555, max: 10, scale: 0, expectResult: '16%' },

      { value: 0, max: 10, scale: 1, expectResult: '0%' },
      { value: 1, max: 10, scale: 1, expectResult: '10%' },
      { value: 1.5, max: 10, scale: 1, expectResult: '15%' },
      { value: 1.55, max: 10, scale: 1, expectResult: '15.5%' },
      { value: 1.555, max: 10, scale: 1, expectResult: '15.6%' },

      { value: 0, max: 10, scale: 2, expectResult: '0%' },
      { value: 1, max: 10, scale: 2, expectResult: '10%' },
      { value: 1.5, max: 10, scale: 2, expectResult: '15%' },
      { value: 1.55, max: 10, scale: 2, expectResult: '15.5%' },
      { value: 1.555, max: 10, scale: 2, expectResult: '15.55%' },
      { value: 1.5555, max: 10, scale: 2, expectResult: '15.56%' }
    ].forEach(({ value, max, scale, expectResult }, index) => {
      it(`should render component as expected (${index + 1})`, async () => {
        const result = getPercentageString(value, max, scale);

        expect(result).toBe(expectResult);
      });
    });
  });
});
