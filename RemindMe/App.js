import React, { useEffect, useState } from 'react';
import { auth } from './firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import AuthScreen from './components/AuthScreen';
import HomeScreen from './components/HomeScreen';
import LogoutScreen from './components/LogoutScreen'; // Tuodaan LogoutScreen
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Ikonikirjasto

const Stack = createStackNavigator();

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

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          <>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={({ navigation }) => ({
                title: 'Home',
                headerRight: () => (
                  <Ionicons
                    name="person-circle-outline"
                    size={32}
                    style={{ marginRight: 16 }}
                    onPress={() => navigation.navigate('Logout')}
                  />
                ),
              })}
            />
            <Stack.Screen
              name="Logout"
              component={LogoutScreen}
              options={{ title: 'Profiili' }} 
            />
          </>
        ) : (
          <Stack.Screen
            name="Auth"
            component={AuthScreen}
            options={{ title: 'Kirjaudu sisään' }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
