import { Text, useColorScheme } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import EstadisticasScreen from '../screens/EstadisticasScreen';
import InicioScreen from '../screens/InicioScreen';
import MovimientosScreen from '../screens/MovimientosScreen';
import PerfilScreen from '../screens/PerfilScreen';
import type { RootTabParamList } from './types';

const Tab = createBottomTabNavigator<RootTabParamList>();

const renderIcon = (emoji: string) => () => <Text>{emoji}</Text>;

function TabNavigator() {
  const isDarkMode = useColorScheme() === 'dark';
  const theme = isDarkMode ? DarkTheme : DefaultTheme;

  return (
    <Tab.Navigator
      initialRouteName="Inicio"
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: theme.colors.card },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: isDarkMode ? '#8e8e93' : '#6b6b6b',
      }}
    >
      <Tab.Screen
        name="Inicio"
        component={InicioScreen}
        options={{ tabBarIcon: renderIcon('🏠') }}
      />
      <Tab.Screen
        name="Movimientos"
        component={MovimientosScreen}
        options={{ tabBarIcon: renderIcon('💸') }}
      />
      <Tab.Screen
        name="Estadisticas"
        component={EstadisticasScreen}
        options={{ title: 'Estadísticas', tabBarIcon: renderIcon('📊') }}
      />
      <Tab.Screen
        name="Perfil"
        component={PerfilScreen}
        options={{ tabBarIcon: renderIcon('👤') }}
      />
    </Tab.Navigator>
  );
}

export default TabNavigator;
