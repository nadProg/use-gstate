import { createGStore } from '../../lib';
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query';
import { useState } from 'react';

// Create a QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Fetch function for Pokemon API
const fetchPokemon = async (id: number) => {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

// Create global state with React Query
const useGlobalPokemon = createGStore(() => {
  // Local state for the Pokemon ID to fetch
  const [pokemonId, setPokemonId] = useState(1);

  // React Query hook for data fetching
  const query = useQuery({
    queryKey: ['pokemon', pokemonId],
    queryFn: () => fetchPokemon(pokemonId),
  });

  // Function to load the next Pokemon
  const loadNextPokemon = () => {
    setPokemonId((prev) => Math.min(prev + 1, 151));
  };

  // Function to load the previous Pokemon
  const loadPreviousPokemon = () => {
    setPokemonId((prev) => Math.max(prev - 1, 1));
  };

  return {
    pokemonId,
    pokemon: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    loadNextPokemon,
    loadPreviousPokemon,
  };
});

// Pokemon details component
function PokemonDetails() {
  const { pokemon, isLoading, isError, pokemonId } = useGlobalPokemon();

  if (isLoading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md animate-pulse">
        <div className="h-20 bg-gray-200 rounded mb-4"></div>
        <div className="h-8 bg-gray-200 rounded mb-2 w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 bg-red-50 rounded-lg shadow-md">
        <h3 className="text-lg font-medium text-red-800">
          Error loading Pokemon
        </h3>
        <p className="text-red-600">Please try again later</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-800">
          #{pokemonId}: {pokemon?.name}
        </h3>
        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
          ID: {pokemonId}
        </span>
      </div>

      {pokemon?.sprites?.front_default && (
        <img
          src={pokemon.sprites.front_default}
          alt={pokemon.name}
          className="mx-auto h-32 w-32"
        />
      )}

      <div className="mt-4">
        <p className="text-sm text-gray-600">
          <span className="font-semibold">Height:</span> {pokemon?.height / 10}m
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-semibold">Weight:</span> {pokemon?.weight / 10}
          kg
        </p>

        <div className="mt-3">
          <p className="text-sm font-semibold text-gray-700">Types:</p>
          <div className="flex gap-2 mt-1">
            {pokemon?.types?.map((type: any) => (
              <span
                key={type.type.name}
                className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded"
              >
                {type.type.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Navigation controls component
function PokemonControls() {
  const { loadPreviousPokemon, loadNextPokemon, isLoading, pokemonId } =
    useGlobalPokemon();

  return (
    <div className="flex justify-between mt-4">
      <button
        onClick={loadPreviousPokemon}
        disabled={isLoading || pokemonId === 1}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 
                  disabled:bg-blue-300 disabled:cursor-not-allowed"
      >
        Previous
      </button>

      <button
        onClick={loadNextPokemon}
        disabled={isLoading || pokemonId === 151}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 
                  disabled:bg-blue-300 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
}

// Export wrapper component with provider
export function ReactQueryExample() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md">
        <h2 className="text-xl font-medium text-gray-800 mb-4">
          React Query + create-gstore
        </h2>
        <p className="text-gray-600 mb-6">
          This example demonstrates how to use React Query with create-gstore to
          create global data fetching state.
        </p>

        <PokemonDetails />
        <PokemonControls />
      </div>
    </QueryClientProvider>
  );
}
