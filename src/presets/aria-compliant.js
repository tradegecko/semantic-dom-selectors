import findByAria from '../finders/find-by-aria/rule';

export default {
  rules: {
    'not-aria-compliant': 0,
  },
  finders: [
    findByAria,
  ],
};
