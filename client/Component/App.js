import React from 'react';
import { MapView, Location,Permissions,LinearGradient,Pedometer,Font } from 'expo';
import { AsyncStorage, StyleSheet, Text, View, StatusBar, Image } from 'react-native';
import { connect } from 'react-redux';
import { createNewWeek, updateData, removeData } from '../redux/getData';
import Map from './Map';

class App extends React.Component {
  state = {
    isFontLoaded1: false,
    isFontLoaded2: false,
    isFontLoaded3: false,
    isPedometerAvailable: "checking",
    monthDate:'',
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
    const time = new Date();
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const weekDays = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    const currentWeekDay = weekDays[time.getDay()];
    const monthDate = months[time.getMonth()]+'/'+time.getDate();
    this.setState({monthDate});

    this._subscribe();
    this.updateData(currentWeekDay);
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

//Call redux to update backend DB at midnight
  updateData=(currentWeekDay)=>{
    const time = new Date();
    time.setHours(23,59,59,999);
    const milliseconds = time.getTime()-new Date().getTime();
    const MILLISECONDS_IN_A_DAY = 86400000;
    const idArr = [];
    this.props.data&&this.props.data.forEach(week=>idArr.push(week._id));
    let reduxProps = this.props;

    let postAtMidNight = setTimeout(function tick(){
      AsyncStorage.getItem('data',(err,result)=>{
        let totalSteps = 0, data = JSON.parse(result);
        data.steps?totalSteps+=data.steps+data.steps2:totalSteps+=data.steps2;
 
        if(idArr===2 && currentWeekDay==='Sun'){
          reduxProps.removeData({id:idArr[0]});
        }
        if(idArr.length===0 && currentWeekDay==='Sun'){
          reduxProps.createNewWeek({date:currentWeekDay,steps:totalSteps});
        }else{
          reduxProps.updateData({id:idArr[idArr.length-1],date:currentWeekDay,steps:totalSteps});
        }
      });
      
      postAtMidNight = setTimeout(tick,MILLISECONDS_IN_A_DAY)
    },milliseconds)
  }

  _subscribe = () => {
    const end = new Date();
    end.setHours(23,59,59,999);
    const start = new Date();
    start.setHours(0,0,0,0);

    this._subscription = Pedometer.watchStepCount(result => {
      let data1={steps:result.steps}
      this.setState({
        currentStepCount: result.steps
      });
      AsyncStorage.mergeItem('data',JSON.stringify(data1));
    });

    Pedometer.isAvailableAsync().then(
      result => {
        this.setState({
          isPedometerAvailable: String(result)
        });
      },
      error => {
        this.setState({
          isPedometerAvailable: "Could not get isPedometerAvailable: " + error
        });
      }
    );


    Pedometer.getStepCountAsync(start, end).then(
      result => {
        let data2={steps2:result.steps}
        this.setState({ pastStepCount: result.steps });
        AsyncStorage.setItem('data', JSON.stringify(data2));
      },
      error => {
        this.setState({
          pastStepCount: error
        });
      }
    );
  };

  _unsubscribe = () => {
    this._subscription && this._subscription.remove();
    this._subscription = null;
  };

  render() {
    // console.log('********', this.props.data)
    const totalSteps = this.state.currentStepCount+this.state.pastStepCount;
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
                <View style={{height:'100%',width:'45%'}}><Text style={[isFontLoaded1 && {fontFamily:'AvenirNextHeavyCondensed',fontSize:50,color:'#E6E7E8',textAlign:'left',marginTop:'10%'}]}>{this.state.monthDate}</Text></View>
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

const mapState = state => {
  return {
    data: state
  }
};
const mapDispatch = dispatch=>({
  createNewWeek: (credentials)=> dispatch(createNewWeek(credentials)),
  updateData: (credentials)=> dispatch(updateData(credentials)),
  removeData: (id)=> dispatch(removeData(id))
});

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
export default connect(mapState,mapDispatch)(App);
