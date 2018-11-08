import React from 'react';
import { Text, View, StyleSheet,Image } from 'react-native';
import { Font } from 'expo';
import Swiper from 'react-native-animated-swiper';
import MedalSrc from './MedalSrc';

export default class Slide extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isFontLoaded1: false,
            isFontLoaded2: false,
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
            'AvenirNextULtltalic': require('../../assets/fonts/AvenirNextULtltalic.ttf')
        }).then(()=>{
            this.setState({
                isFontLoaded2: true
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
        const { isFontLoaded1,isFontLoaded2,isFontLoaded3 } = this.state;
        return (
            <Swiper>
                <View style={styles.slide}>

                            {[10000,20000,30000,40000,50000].map((steps,index)=>{
                                return(
                                        <View key={steps} style={styles.medal}>
                                            <Image style={[styles.image,{opacity:.1}]} source={MedalSrc[index]}/>
                                            <Text style={isFontLoaded3&&{fontFamily:'AvenirNextDemiItalic',color: 'black',opacity:.4, fontSize: 15}}>{steps}</Text>
                                        </View>
                                )
                            })}
                </View>
                <View style={styles.slide}>
                        <Image style={styles.image} source={require('../../assets/icon1.png')}/>
                        <Text style={isFontLoaded2&&{fontFamily:'AvenirNextULtltalic',color: 'black', fontSize: 18, marginTop:'4%'}}><Text style={isFontLoaded1&&{fontFamily:'AvenirNextHeavyCondensed',fontSize: 37}}>10000</Text> Steps on 10/23/2018</Text>
                </View>
                <View style={styles.slide}>
                        <Image style={styles.image} source={require('../../assets/icon7.png')}/>
                        <Text style={isFontLoaded2&&{fontFamily:'AvenirNextULtltalic',color: 'black', fontSize: 18, marginTop:'4%'}}><Text style={isFontLoaded1&&{fontFamily:'AvenirNextHeavyCondensed',fontSize: 37}}>10000</Text> Steps in current week</Text>
                </View>
                <View style={styles.slide}>
                        <Image style={styles.image} source={require('../../assets/icon6.png')}/>
                        <Text style={isFontLoaded2&&{fontFamily:'AvenirNextULtltalic',color: 'black', fontSize: 18, marginTop:'4%'}}><Text style={isFontLoaded1&&{fontFamily:'AvenirNextHeavyCondensed',fontSize: 37}}>1000</Text> Steps to the next level</Text>
                </View>
            </Swiper>
        )
    }
}

const styles = StyleSheet.create({
    slide: { alignItems: 'center', flex: 1, justifyContent: 'center',flexDirection: 'row' },
    image: {
        height:45,width:45
    },
    medal: {
        width:'18%',height:'100%',flexDirection:'column',justifyContent:'center',alignItems:'center'
    }
  });