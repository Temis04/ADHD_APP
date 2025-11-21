import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import BottomTabNavigator from './src/navigation/BottomTabNavigator';
import ErrorBoundary from './src/components/ErrorBoundary';
import { useTaskStore } from './src/store/taskStore';
import { View, Text } from 'react-native';

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const initialize = useTaskStore((state) => state.initialize);

  useEffect(() => {
    // Initialize store once
    initialize();
    setIsReady(true);
  }, []);

  if (!isReady) {
    return (
      <View style={[styles.container, { backgroundColor: '#0F0F0F', alignItems: 'center', justifyContent: 'center' }]}>
        <Text style={{ color: '#FFFFFF' }}>Loading...</Text>
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={styles.container}>
        <NavigationContainer>
          <BottomTabNavigator />
          <StatusBar style="light" />
        </NavigationContainer>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
