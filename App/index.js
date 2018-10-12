import { createStackNavigator } from  'react-navigation';
import Home from './Component/Home';
import App from './Component/App';
// import Map from './Component/Map';
import { Easing } from 'react-native'

export default RootNavigator = createStackNavigator({
    Main: {
        screen: Home

    },
    App: {
        screen: App
    }
},{headerMode:'none',
transitionConfig: () => ({
  transitionSpec: {
    duration: 1000,
    easing: Easing.out(Easing.poly(4)),
    // timing: Animated.timing,
  },
  screenInterpolator: sceneProps => {      
    const { position, scene } = sceneProps

    const thisSceneIndex = scene.index

    const opacity = position.interpolate({
      inputRange: [thisSceneIndex - 1, thisSceneIndex],
      outputRange: [0, 1],
    })

    return { opacity } 
  }
})    
})