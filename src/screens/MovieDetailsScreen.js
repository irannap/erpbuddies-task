// screens/MovieDetails.js
import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

// Fetch movie details from TMDB API
const fetchMovieDetails = async (movieId) => {
  const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
    params: {
      api_key: '178c59eb9584e9acb9bbcc362f5434f7', 
    },
  });
  return response.data;
};

// Functional component to display movie details
const MovieDetailsScreen = ({ route }) => {
  // Extract movieId from route params
  const { movieId } = route.params;

  // Query for fetching movie details
  const { data, error, isLoading } = useQuery({
    queryKey: ['movieDetails', movieId],
    queryFn: () => fetchMovieDetails(movieId),
  });

  // Loading indicator while fetching data
  if (isLoading) {
    return <ActivityIndicator size="large" style={styles.loading} />;
  }

  // Error message if fetching movie details fails
  if (error) {
    return <Text style={styles.error}>Error fetching movie details</Text>;
  }

  // Render movie details
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Image
          source={{ uri: `https://image.tmdb.org/t/p/w500${data.poster_path}` }}
          style={styles.poster}
        />
        <View style={styles.infoContainer}>
          <Text style={styles.title}>{data.title}</Text>
          <Text style={styles.releaseDate}>{new Date(data.release_date).getFullYear()}</Text>
          <Text style={styles.description}>{data.overview}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

// Styles for the component
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    padding: 20,
    alignItems: 'center',
    width: '100%',
  },
  poster: {
    width: 300,
    height: 450,
    borderRadius: 10,
    marginBottom: 20,
  },
  infoContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  releaseDate: {
    fontSize: 18,
    color: 'gray',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    color: 'red',
  },
});

export default MovieDetailsScreen;
