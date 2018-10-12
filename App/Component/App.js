import React from 'react';
import { MapView, Location,Permissions,LinearGradient,Pedometer,Font } from 'expo';
import { StyleSheet, Text, View, StatusBar, Image } from 'react-native';
import Map from './Map';

export default class App extends React.Component {
  state = {
    isFontLoaded1: false,
    isFontLoaded2: false,
    isFontLoaded3: false,
    date:'',
    pastStepCount: 0,
    currentStepCount: 0
  };

  componentDidMount() {

    Font.loadAsync({
      'AvenirNextHeavyCondensed': require('../../assets/fonts/AvenirNextHeavyCondensed.ttf')
  }).then(()=>{
      this.setState({
          isFontLoaded1: true
      })
  });
  Font.loadAsync({
      'AvenirNextULtCondensedItalic': require('../../assets/fonts/AvenirNextULtCondensedItalic.ttf')
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

    this._subscribe();
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  _subscribe = () => {
    this._subscription = Pedometer.watchStepCount(result => {
      this.setState({
        currentStepCount: result.steps
      });
    });

    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 1);
    Pedometer.getStepCountAsync(start, end).then(
      result => {
        this.setState({ pastStepCount: result.steps });
      },
      error => {
        this.setState({
          pastStepCount: "Could not get stepCount: " + error
        });
      }
    );
  };

  _unsubscribe = () => {
    this._subscription && this._subscription.remove();
    this._subscription = null;
  };

  render() {
    const mySteps = this.state.currentStepCount;
    const { isFontLoaded1, isFontLoaded2, isFontLoaded3 } = this.state;
    return (
      <View style={styles.container}>
        <StatusBar hidden={ true }/>
        <Map />
        <LinearGradient colors={['rgba(255,255,255,0)','white','white']} style={styles.gradient}/>
        <View style={styles.control}>
            <View style={{height:'20%',width:'95%',marginLeft: 'auto',marginRight: 'auto',flexDirection:'row'}}>
                <View style={{height:'100%',width:'56%'}}><Text style={[isFontLoaded1 && {fontFamily:'AvenirNextHeavyCondensed',fontSize:68,color:'#6666FF',textAlign:'right',marginTop:'2%'}]}>{this.state.pastStepCount+this.state.currentStepCount}</Text></View>
                <View style={{height:'100%',width:'20%'}}><Text style={[isFontLoaded2 && {fontFamily:'AvenirNextULtCondensedItalic',fontSize:36,color:'#6666FF',marginTop:'40%',textAlign:'center'}]}>Steps</Text></View>
                <View style={{height:'100%',width:'24%'}}><Image style={{marginTop:'-16%'}} source={require('../../assets/walk.jpg')}/></View>
            </View>
            <View style={{height:'20%',width:'95%',marginLeft: 'auto',marginRight: 'auto',flexDirection:'row',marginTop:'-7%'}}>
                <View style={{height:'100%',width:'35%'}}><Text style={[isFontLoaded1 && {fontFamily:'AvenirNextHeavyCondensed',fontSize:68,color:'#6666FF',textAlign:'right'}]}>{((this.state.pastStepCount+this.state.currentStepCount)/2000).toFixed(1)}</Text></View>
                <View style={{height:'100%',width:'20%'}}><Text style={[isFontLoaded2 && {fontFamily:'AvenirNextULtCondensedItalic',fontSize:36,color:'#6666FF',marginTop:'36%',textAlign:'center'}]}>Miles</Text></View>
                <View style={{height:'100%',width:'45%'}}><Text style={[isFontLoaded1 && {fontFamily:'AvenirNextHeavyCondensed',fontSize:50,color:'#E6E7E8',textAlign:'left',marginTop:'10%'}]}>{this.state.date}</Text></View>
            </View>
            <View style={{height:'16%',width:'95%',marginLeft: 'auto',marginRight: 'auto',marginTop:'-4%'}}>
                <View style={{flexDirection:'row',height:'40%',width:'100%'}}>
                    <View style={{height:'100%',width:'50%'}}><Text style={[isFontLoaded2 && {fontFamily:'AvenirNextULtCondensedItalic',fontSize:20,color:'#BCBEC0',textAlign:'center'}]}>Previous Week</Text></View>
                    <View style={{height:'100%',width:'50%'}}><Text style={[isFontLoaded2 && {fontFamily:'AvenirNextULtCondensedItalic',fontSize:20,color:'#6666FF',textAlign:'center'}]}>Current Week</Text></View>
                </View>
                <View style={{height:'1%',width:'100%',backgroundColor:'#E6E7E8',marginTop:'-1%'}}></View>
                <View style={{flexDirection:'row',height:'55%',width:'100%',marginTop:'3%'}}>
                  <View style={{height:'100%',width:'50%'}}><Text style={[isFontLoaded2 && {fontFamily:'AvenirNextULtCondensedItalic',fontSize:20,color:'#BCBEC0',textAlign:'center'}]}> Steps</Text></View>
                  <View style={{height:'100%',width:'50%'}}><Text style={[isFontLoaded2 && {fontFamily:'AvenirNextULtCondensedItalic',fontSize:20,color:'#6666FF',textAlign:'center'}]}> Steps</Text></View>
                </View>
            </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradient: {
    marginTop: '-15%',
    height: '8%',
    width: '100%', 
    alignItems: 'center',
    justifyContent: 'center'
  },
  control: {
    height: '62%',
    width: '100%', 
    alignItems: 'center',
    backgroundColor: 'white'
  }
});

Expo.registerRootComponent(App);

