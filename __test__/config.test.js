import config from '../src/config';

describe('Configuration Module', () => {
  afterEach(() => {
    config.reset();
  });

  describe('Trim', () => {
    afterEach(() => {
      document.body.innerHTML = '';
    });

    test('it trims markup to single-spaced string', () => {
      const markup = `
        <button id="expected">
          <h3>Button Title</h3>
          <p>Description</p>
        </button>
      `;
      document.body.innerHTML = markup;
      expect(config.trim(document.body.innerHTML))
        .toEqual('<button id="expected"> <h3>Button Title</h3> <p>Description</p> </button>');
    });

    test('check dom', () => {
      expect(document.body.innerHTML).toEqual('');
    });
  });

  describe('Finder registration', () => {
    describe('Registering a finder', () => {
      it('adds it to registerdFinderArray', () => {
        config.registerFinder({
          key: 'custom-finder',
        });
        expect(config.registeredFinders.length).toEqual(1);
      });

      describe('sets a rule', () => {
        describe('no rule previously set', () => {
          it('adds a default rule with level of 1', () => {
            config.registerFinder({
              key: 'custom-finder',
            });
            expect(config.rules['custom-finder']).toEqual(1);
          });
        });

        describe('rule previously set', () => {
          it('does not override setting', () => {
            config.errorLevelOptions = {
              'custom-finder': 2,
            };
            config.registerFinder({
              key: 'custom-finder',
            });
            expect(config.rules['custom-finder']).toEqual(2);
          });
        });
      });
    });
  });

  describe('Actor registraition', () => {
    describe('if type is specified', () => {
      it('adds it to actor array', () => {
        config.registerActor({
          type: 'select',
          run: () => { },
        });
        expect(config.customActors.select.length).toEqual(1);
      });

      test('#getActors returns actors hash', () => {
        config.registerActor({
          type: 'select',
          run: () => { },
        });
        expect(config.actors).toEqual(config.customActors);
      });
    });

    describe('if type is not specified', () => {
      it('adds it to actor array', () => {
        expect(() => {
          config.registerActor({
            run: () => { },
          });
        }).toThrowErrorMatchingSnapshot();
      });
    });


    describe('if unkown type is specified', () => {
      it('adds it to actor array', () => {
        expect(() => {
          config.registerActor({
            type: 'nonsense',
            run: () => { },
          });
        }).toThrowErrorMatchingSnapshot();
      });
    });
  });

  describe('Rule customisation', () => {
    describe('--deprecations-- when using a deprecated rule name', () => {
      let rules;

      beforeEach(() => {
        rules = {
          ariaNotFound: 2,
          invalidFor: 1,
          perceivedByName: 0,
        };
      });

      it('notifies user that rule name is deprecated', () => {
        const originalWarn = console.warn;
        console.warn = jest.fn();
        config.remapDeprecatedRules(rules);
        expect(console.warn).toHaveBeenNthCalledWith(1, 'DEPRECATION: rule ariaNotFound name is deprecated please use aria-compliant');
        expect(console.warn).toHaveBeenNthCalledWith(2, 'DEPRECATION: rule invalidFor name is deprecated please use invalid-label-for');
        expect(console.warn).toHaveBeenNthCalledWith(3, 'DEPRECATION: rule perceivedByName name is deprecated please use name-attribute');
        console.warn = originalWarn;
      });

      it('maps rule to new name', () => {
        const result = config.remapDeprecatedRules(rules);
        expect(result).toEqual({
          'aria-compliant': 2,
          'invalid-label-for': 1,
          'name-attribute': 0,
        });
      });

      it('calls remapDeprecatedRules', () => {
        config.setErrorLevels({
          ariaNotFound: 2,
        });
        expect(config.errorLevelOptions).toEqual({
          'aria-compliant': 2,
        });
      });
    });

    test('you can whole sale set error levels', () => {
      config.setErrorLevels({
        'custom-finder': 2,
      });
      expect(config.errorLevelOptions).toEqual({
        'custom-finder': 2,
      });
    });
  });
});
