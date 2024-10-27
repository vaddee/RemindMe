import React, { useEffect, useState } from 'react';
import { auth } from './firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import AuthScreen from './components/AuthScreen';
import HomeScreen from './components/HomeScreen';
import LogoutScreen from './components/LogoutScreen';
import SavedNamesScreen from './components/SavedNamesScreen';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user ? user : null);
    });

    return unsubscribe;
  }, []);

  // Alatason navigaattori
  const HomeTabs = ({ navigation }) => (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'SavedNames') {
            iconName = 'people';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        headerRight: () => ( // Käytetään navigation-proppia HomeTabs-komponentissa
          <Ionicons
            name="person-circle-outline"
            size={32}
            style={{ marginRight: 16 }}
            onPress={() => navigation.navigate('Logout')}
          />
        ),
      })}
    >
      <Tab.Screen
        name="Home"
        children={() => <HomeScreen user={user} />}
        options={{ title: 'Home' }}
      />
      <Tab.Screen name="SavedNames" component={SavedNamesScreen} options={{ title: 'Saved Names' }} />
    </Tab.Navigator>
  );

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          <>
            <Stack.Screen
              name="HomeTabs"
              component={HomeTabs}
              options={{ headerShown: false }} // Piilotetaan HomeTabs-otsikko
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
