import React from 'react';
import { Font } from 'expo';
import { StyleSheet, Text, View, StatusBar } from 'react-native';
import { connect } from 'react-redux';
import { fetchData } from '../redux/getData';


class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isFontLoaded1: false,
            isFontLoaded2: false
        }
    }

    componentDidMount() {
        //call fetch data
        this.props.fetchInitialData();

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

const mapState = null;

const mapDispatch = dispatch => ({
  fetchInitialData: () => {
	dispatch(fetchData())
  }
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center" 
    },
    font1: {
        fontSize: 90,
        color: 'black',
        width: '100%',
        textAlign: 'center',
     },
     font2: {
         marginTop:-6, marginLeft:-15,
         fontSize: 20,
         width: '100%',
         textAlign: 'center',
         color: 'black'
      }
});

Expo.registerRootComponent(Home);
export default connect(mapState, mapDispatch)(Home);