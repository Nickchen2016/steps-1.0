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
                    size={280}
                    width={20}
                    fill={Math.floor(this.props.todaySteps/this.props.currentGoal*100)+1}
                    prefill={0}
                    tintColor="black"
                    onAnimationComplete={() => console.log('onAnimationComplete')}
                    backgroundColor="#bcbec0"
                >
                    {
                        fill => (
                            <View style={{flexDirection:'column',alignItems:'center'}}>
                                <Text style={isFontLoaded1&&{fontFamily:'AvenirNextHeavyCondensed',fontSize:72}}>
                                    {this.props.todaySteps}
                                </Text>
                                <View style={{flexDirection:'row',marginTop:'-5%'}}>
                                    <Text style={isFontLoaded3&&{fontFamily:'AvenirNextDemiItalic',fontSize:50}}>{(this.props.todaySteps/2000).toFixed(1)} mi</Text>
                                    <Image style={{height:60,width:60,marginTop:'-5%'}} source={require('../../assets/walk.png')}/>
                                </View>
                            </View>
                        )
                    }
                </AnimatedCircularProgress>
          </View>  
        )
    }
}

const styles = StyleSheet.create({
   container: {
       width:'100%',height:'100%',
       alignItems:'center',
       marginTop: '10%'
   }
  });