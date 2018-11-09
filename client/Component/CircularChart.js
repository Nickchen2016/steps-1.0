import React from 'react';
import { Text, View, StyleSheet,Image } from 'react-native';
import { Font } from 'expo';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

export default class CircularChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isFontLoaded1: false,
            isFontLoaded3: false,
        }
    }

    componentDidMount(){
        Font.loadAsync({
            'AvenirNextHeavyCondensed': require('../../assets/fonts/AvenirNextHeavyCondensed.ttf')
        }).then(()=>{
            this.setState({
                isFontLoaded1: true
            })
        });
        Font.loadAsync({
            'AvenirNextDemiItalic': require('../../assets/fonts/AvenirNextDemiItalic.ttf')
        }).then(()=>{
          this.setState({
              isFontLoaded3: true
          })
        });
    }

    render() {
        const { isFontLoaded1,isFontLoaded3 } = this.state;
        return (
          <View style={styles.container}>
                <AnimatedCircularProgress
                size={250}
                width={20}
                fill={100}
                tintColor="black"
                onAnimationComplete={() => console.log('onAnimationComplete')}
                backgroundColor="black" />
          </View>  
        )
    }
}

const styles = StyleSheet.create({
   container: {
       width:'100%',height:'100%',
       alignItems:'center',
       marginTop: '12%'
   }
  });