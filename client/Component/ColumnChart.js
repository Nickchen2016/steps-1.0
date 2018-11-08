import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Font } from 'expo';

export default class ColumnChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isFontLoaded3: false,
        }
    }

    componentDidMount(){
        Font.loadAsync({
            'AvenirNextDemiItalic': require('../../assets/fonts/AvenirNextDemiItalic.ttf')
        }).then(()=>{
          this.setState({
              isFontLoaded3: true
          })
        });
    }

    render() {
        // console.log('-------------',this.props.lastWeekData, this.props.currentWeekData)
        const { isFontLoaded3 } = this.state;
        return (
            <View style={styles.container}>
                <View style={styles.box1}>
                    {this.props.lastWeekData&&this.props.lastWeekData.map((step,index)=>{
                        return(
                            <View key={index} style={styles.outline}>
                                <TouchableOpacity style={[styles.column1,{height:Math.floor(step/30000*168)}]}></TouchableOpacity>
                            </View>
                        )
                    })}
                </View>
                <View style={styles.box2}>
                {this.props.currentWeekData&&this.props.currentWeekData.map((step,index)=>{
                    return(
                        <View key={index} style={styles.outline}>
                            <TouchableOpacity style={[styles.column2,{height:Math.floor(step/30000*168)}]}></TouchableOpacity>
                        </View>
                    )
                })}
            </View>
        </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        width:'100%', height:'100%',flexDirection:'row',alignItems:'center'
    },
    box1: {
        width:'100%', height:'100%',flexDirection:'row',alignItems:'center'
    },
    box2: {
        width:'100%', height:'100%',flexDirection:'row',alignItems:'center',marginLeft:'-100%'
    },
    outline: {
        width: '14.3%',height:'100%',
        // borderStyle:'solid', borderWidth:1,
        alignItems:'center'
    },
    column1: {
        position: 'absolute',
        bottom:0,
        margin: '5% 0% 5% 0%',
        width:15,
        backgroundColor:'black',
        opacity:0.1,
        borderRadius: 100
    },
    column2: {
        position: 'absolute',
        bottom:0,
        margin: '5% 0% 5% 0%',
        width:15,
        backgroundColor:'black',
        opacity:0.6,
        borderRadius: 100
    }
  });