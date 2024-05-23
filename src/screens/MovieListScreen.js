// screens/MovieList.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';

// Fetch movies from TMDB API
const fetchMovies = async ({ pageParam = 1 }) => {
  const response = await axios.get('https://api.themoviedb.org/3/movie/popular', {
    params: {
      api_key: '178c59eb9584e9acb9bbcc362f5434f7', 
      page: pageParam,
    },
  });
  return response.data;
};

// Functional component for displaying a list of movies
const MovieListScreen = ({ navigation }) => {
  // State variables
  const [search, setSearch] = useState(''); // State for storing search query
  const [isSearching, setIsSearching] = useState(false); // State for indicating if search is in progress

  // Query to fetch movies
  const {
    data,
    error,
    isLoading,
    isFetching,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['movies', search],
    queryFn: fetchMovies,
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.page < lastPage.total_pages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    onSuccess: () => {
      setIsSearching(false);
    },
  });

  // Handler for refreshing the movie list
  const handleRefresh = () => {
    refetch();
  };

  // Function to load more movies when scrolling
  const loadMoreMovies = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  // Handler for input change in the search bar
  const handleSearchChange = (text) => {
    setSearch(text);
    setIsSearching(true);
    refetch();
  };

  // Filter movies based on search query
  const filteredMovies = data?.pages
    ?.flatMap((page, pageIndex) =>
      page.results.map(movie => ({
        ...movie,
        uniqueKey: `${pageIndex}-${movie.id}`,
      }))
    )
    .filter(movie => movie.title.toLowerCase().includes(search.toLowerCase())) || [];

  // Loading indicator while fetching data
  if (isLoading) {
    return <ActivityIndicator size="large" style={styles.loading} />;
  }

  // Error message if fetching movies fails
  if (error) {
    return <Text style={styles.error}>Error fetching movies</Text>;
  }

  // Render individual movie item
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.movieContainer}
      onPress={() => navigation.navigate('MovieDetails', { movieId: item.id })}
    >
      <Image
        source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
        style={styles.poster}
      />
      <View style={styles.movieInfo}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.releaseDate}>{new Date(item.release_date).getFullYear()}</Text>
        <Text style={styles.description}>{item.overview.substring(0, 100)}...</Text>
      </View>
    </TouchableOpacity>
  );

  // Main component rendering
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search movies..."
        value={search}
        onChangeText={handleSearchChange}
      />
      {(isSearching || isFetching) && <ActivityIndicator size="small" style={styles.searchLoading} />}
      <FlatList
        data={filteredMovies}
        keyExtractor={(item) => item.uniqueKey}
        renderItem={renderItem}
        onEndReached={loadMoreMovies}
        onEndReachedThreshold={0.5}
        ListFooterComponent={isFetching && hasNextPage ? <ActivityIndicator style={styles.loadingMore} /> : null}
        refreshControl={<RefreshControl refreshing={isFetching} onRefresh={handleRefresh} />}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

// Styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f8f8f8',
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: 'white',
  },
  searchLoading: {
    marginVertical: 10,
  },
  list: {
    paddingBottom: 20,
  },
  movieContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    padding: 10,
  },
  poster: {
    width: 100,
    height: 150,
    borderRadius: 10,
  },
  movieInfo: {
    marginLeft: 10,
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  releaseDate: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: 'gray',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingMore: {
    marginVertical: 20,
  },
  error: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    color: 'red',
  },
});

export default MovieListScreen;
