import React, { useEffect, useState } from 'react';
import { auth } from './firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import AuthScreen from './components/AuthScreen';
import HomeScreen from './components/HomeScreen';

export default function App() {
  const [user, setUser] = useState(null);

  // Seurataan kirjautumistilaa
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user); // Käyttäjä on kirjautunut
      } else {
        setUser(null); // Käyttäjä ei ole kirjautunut
      }
    });

    return unsubscribe; // Poistetaan kuuntelija
  }, []);

  return user ? <HomeScreen user={user} /> : <AuthScreen />;
}
