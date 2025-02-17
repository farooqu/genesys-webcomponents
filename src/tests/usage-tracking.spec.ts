import {
  trackComponent,
  trackAction,
  getVersionObject
} from '../usage-tracking';
import packageInfo from '../../package.json';

const component = document.createElement('gux-button');
const addPageAction = jest.fn();

describe('usage-tracking', () => {
  beforeEach(() => {
    addPageAction.mockClear();
    window.newrelic = {
      addPageAction
    };
  });

  describe('Component usage tracking', () => {
    test("Doesn't throw when newrelic is not present", () => {
      window.newrelic = undefined;
      expect(() => {
        trackComponent(component);
      }).not.toThrow();
    });

    test('Logs the libarary version when first called', () => {
      trackComponent(component);
      expect(addPageAction).toHaveBeenCalledTimes(2);
      expect(addPageAction.mock.calls[0][0]).toBe('spark-library');
      const versionInfo = addPageAction.mock.calls[0][1];
      expect(versionInfo.fullVersion).toBe(packageInfo.version);
      expect(packageInfo.version.startsWith(versionInfo.majorVersion)).toBe(
        true
      );
      expect(packageInfo.version.startsWith(versionInfo.minorVersion)).toBe(
        true
      );
    });

    test('Does not log the library version on subsequent calls', () => {
      trackComponent(component);
      expect(addPageAction).toHaveBeenCalledTimes(1);
    });

    test('Logs the tag name and library version when', () => {
      trackComponent(component);
      expect(addPageAction).toHaveBeenCalledWith('spark-component', {
        component: 'gux-button',
        version: packageInfo.version
      });
    });

    test('Optionally logs a tag variant', () => {
      trackComponent(component, { variant: 'test' });
      expect(addPageAction).toHaveBeenCalledWith('spark-component', {
        component: 'gux-button',
        version: packageInfo.version,
        variant: 'test'
      });
    });
  });

  describe('Component action tracking', () => {
    test("Doesn't throw when newrelic is not present", () => {
      window.newrelic = undefined;
      expect(() => {
        trackAction(component);
      }).not.toThrow();
    });

    test('Logs the component tag and action', () => {
      trackAction(component, 'click');
      expect(addPageAction).toHaveBeenCalledWith('spark-action', {
        component: 'gux-button',
        action: 'click'
      });
    });

    test('Optionally logs metadata', () => {
      trackAction(component, 'click', { strength: 'real hard' });
      expect(addPageAction).toHaveBeenCalledWith('spark-action', {
        component: 'gux-button',
        action: 'click',
        strength: 'real hard'
      });
    });
  });
});

describe('getVersionObject', () => {
  [
    {
      packageLockVersion: '0.0.1',
      expectedVersionObject: {
        fullVersion: '0.0.1',
        majorVersion: '0',
        minorVersion: '0.0'
      }
    },
    {
      packageLockVersion: '0.1.1',
      expectedVersionObject: {
        fullVersion: '0.1.1',
        majorVersion: '0',
        minorVersion: '0.1'
      }
    },
    {
      packageLockVersion: '1.1.1',
      expectedVersionObject: {
        fullVersion: '1.1.1',
        majorVersion: '1',
        minorVersion: '1.1'
      }
    },
    {
      packageLockVersion: '2.0.0-alpha.0',
      expectedVersionObject: {
        fullVersion: '2.0.0-alpha.0',
        majorVersion: '2',
        minorVersion: '2.0'
      }
    }
  ].forEach(({ packageLockVersion, expectedVersionObject }, index) => {
    it(`should return expected versionObject (${index + 1})`, async () => {
      const versionObject = getVersionObject(packageLockVersion);

      expect(versionObject).toEqual(expectedVersionObject);
    });
  });
});
