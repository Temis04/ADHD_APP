import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { useEffect } from 'react';
import BottomTabNavigator from './src/navigation/BottomTabNavigator';
import ErrorBoundary from './src/components/ErrorBoundary';
import { initializeTaskStore } from './src/store/taskStore';

export default function App() {
  useEffect(() => {
    // Initialize store once when app mounts
    initializeTaskStore();
  }, []);

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
