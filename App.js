// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import MovieListScreen from './src/screens/MovieListScreen';
import MovieDetailsScreen from './src/screens/MovieDetailsScreen';

// Create a stack navigator for navigation between screens
const Stack = createNativeStackNavigator();
// Initialize a new query client
const queryClient = new QueryClient();

// Main component of the application
export default function App() {
  return (
    // Provide the query client to the entire app using QueryClientProvider
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        {/* Stack navigator for managing navigation between screens */}
        <Stack.Navigator>
          {/* Screen for displaying a list of popular movies */}
          <Stack.Screen name="MovieList" component={MovieListScreen} options={{ title: 'Popular Movies' }} />
          {/* Screen for displaying details of a specific movie */}
          <Stack.Screen name="MovieDetails" component={MovieDetailsScreen} options={{title: 'Movie details'}} />
        </Stack.Navigator>
      </NavigationContainer>
    </QueryClientProvider>
  );
}
