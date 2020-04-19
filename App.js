import React from 'react';
import HomeScreen from './components/HomeScreen';
import DetailScreen from './components/DetailScreen';
import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";
import 'react-native-gesture-handler';

const RootStack = createStackNavigator(
  {
    Home: {
      screen: HomeScreen
    },
    Details: {
      screen: DetailScreen
    }
  },
  {
    initialRouteName: 'Home',
  }
);

const AppContainer = createAppContainer(RootStack);

export default class App extends React.Component {

  render() {
    return (
      <AppContainer />
    );
  }
}
