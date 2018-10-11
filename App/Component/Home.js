import React from 'react';
import { Font } from 'expo';
import { StyleSheet, Text, View, StatusBar } from 'react-native';


export default class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isFontLoaded1: false,
            isFontLoaded2: false
        }
    }

    componentDidMount() {

        Font.loadAsync({
            'AvenirNextHeavyItalic': require('../../assets/fonts/AvenirNextHeavyItalic.ttf')
        }).then(()=>{
            this.setState({
                isFontLoaded1: true
            })
        });
        Font.loadAsync({
            'AvenirNextULtltalic': require('../../assets/fonts/AvenirNextULtltalic.ttf')
        }).then(()=>{
            this.setState({
                isFontLoaded2: true
            })
        });

        const { navigate } = this.props.navigation;
        setTimeout(() => {
            navigate('App');
        }, 1500)
    }

    render() {
        const { isFontLoaded1, isFontLoaded2 } = this.state;
        return (
            <View style={styles.container}>
                <StatusBar hidden={ true }/>
                <Text style={[styles.font1,isFontLoaded1 && {fontFamily: 'AvenirNextHeavyItalic'}]}>Steps.</Text>
                <Text style={[styles.font2, isFontLoaded2 && {fontFamily: 'AvenirNextULtltalic'}]}>Step out of your comfort zoom</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center" 
    },
    font1: {
        fontSize: 90,
        color: '#3300FF',
        width: '100%',
        textAlign: 'center',
     },
     font2: {
         marginTop:-6, marginLeft:-15,
         fontSize: 20,
         width: '100%',
         textAlign: 'center',
         color: '#3300FF'
      }
});

Expo.registerRootComponent(Home);