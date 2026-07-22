import { Platform } from 'react-native';

// The CREMA wordmark and drink names use a serif for a café-menu feel. Fall
// back gracefully per platform (Georgia on iOS/web, the system serif on Android).
export const serif = Platform.select({
  ios: 'Georgia',
  android: 'serif',
  default: 'Georgia',
});
