import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>You</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.darkBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    ...typography.heading1,
    color: colors.textPrimary,
  },
});
