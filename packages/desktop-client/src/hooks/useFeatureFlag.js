import { useSelector } from 'react-redux';

import {
  isDevelopmentEnvironment,
  isPreviewEnvironment,
} from 'loot-design/src/util/environment';

const DEFAULT_FEATURE_FLAG_STATE = {
  newAutocomplete: isDevelopmentEnvironment() || isPreviewEnvironment(),
  syncAccount: false,
  goalTemplatesEnabled: false,
};

export default function useFeatureFlag(name) {
  return useSelector(state => {
    const value = state.prefs.local[`flags.${name}`];

    return value === undefined
      ? DEFAULT_FEATURE_FLAG_STATE[name] || false
      : value;
  });
}

export function useAllFeatureFlags() {
  return useSelector(state => {
    return {
      ...DEFAULT_FEATURE_FLAG_STATE,
      ...Object.fromEntries(
        Object.entries(state.prefs.local)
          .filter(([key]) => key.startsWith('flags.'))
          .map(([key, value]) => [key.replace('flags.', ''), value]),
      ),
    };
  });
}
