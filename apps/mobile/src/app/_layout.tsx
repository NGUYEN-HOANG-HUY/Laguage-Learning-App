import { SQLiteProvider } from 'expo-sqlite';
import { Stack } from 'expo-router';

import { initializeLocalSrs } from '../lib/local-srs';

export default function RootLayout() {
  return (
    <SQLiteProvider databaseName="language-learning.db" onInit={initializeLocalSrs}>
      <Stack screenOptions={{ headerShown: false }} />
    </SQLiteProvider>
  );
}
