import 'expo-dev-client';
import { NavigationContainer} from '@react-navigation/native';
import { createStackNavigator,CardStyleInterpolators} from '@react-navigation/stack';
import AnimatedSplashScreen from './AnimatedSplashScreen';
import LoginScreen from './LoginScreen';
import SigninScreen from './SigninScreen';
import userProfile from './userProfile';
import MainScreen from './MainScreen'; // Import the MapScreen

const Stack = createStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions = {{gestureEnabled: false, cardStyleInterpolator: ({current}) => ({cardStyle:{opacity: current.progress,},}), }}>
        <Stack.Screen name="Splash" component={AnimatedSplashScreen} options={{ headerShown: false}}/>
        <Stack.Screen name="Login" component={LoginScreen} options={{headerLeft: null, headerShown: false}} />
        <Stack.Screen name="Signin" component={SigninScreen} options={{headerShown: false}}/>
        <Stack.Screen name="userProfile" component={userProfile} options={{cardStyleInterpolator:CardStyleInterpolators.forHorizontalIOS, title:'User Profile'}}/>
        {/* Add more screens as you develop your app */}
        <Stack.Screen name="MainScreen" component={MainScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
