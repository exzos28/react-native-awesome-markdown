import { Platform, StyleSheet, type ViewStyle } from 'react-native';

/**
 * ONLY WEB
 */
const debugStyles = StyleSheet.create({
  rootTextContainer: {
    outlineWidth: 1,
    outlineColor: 'yellow',
    outlineStyle: 'solid',
  } as ViewStyle,
  rootType: {
    position: 'absolute',
    top: 0,
    left: 0,
    fontWeight: 400,
    fontSize: 8,
    backgroundColor: 'yellow',
    zIndex: 2,
  },
  type: {
    position: 'absolute',
    top: 0,
    right: 0,
    fontWeight: 400,
    fontSize: 8,
    backgroundColor: '#00BBFF',
    // transform: [{ rotate: '-90deg' }, { translateX: -2 }, { translateY: 3 }],
  },
  textContainer: {
    outlineWidth: 1,
    outlineColor: '#00BBFF',
    outlineStyle: 'solid',
  } as ViewStyle,
});

export default abstract class Debug {
  static get styles() {
    if (Platform.OS !== 'web' && __DEV__) {
      throw new Error('Debug styles not supported on this platform.');
    }
    return debugStyles;
  }
}
