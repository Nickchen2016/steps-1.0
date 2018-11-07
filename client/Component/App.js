import React from 'react';
import { Permissions,Pedometer,Font } from 'expo';
import { AsyncStorage, StyleSheet, Text, View, StatusBar, Image, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { createNewWeek, updateData, removeData } from '../redux/getData';

class App extends React.Component {
  state = {
    isFontLoaded1: false,
    isFontLoaded2: false,
    isFontLoaded3: false,
    isPedometerAvailable: "checking",
    currentWeekDay:null,
    currentWeekBest:{},
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
    // const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    // const weekDays = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    const currentWeekDay = time.getDay();
    this.setState({currentWeekDay});

    const currentWeekData = [0,0,0,0,0,0,0];
    this.props.data&&this.props.data.length>0?this.props.data[this.props.data.length-1].dates.forEach(d=>currentWeekData[d.date]=d.steps):'';
    const currentweekBestStep = Math.max.apply(null,currentWeekData);
    const currentWeekBest = {date:currentWeekData.indexOf(currentweekBestStep),step:currentweekBestStep};
    this.setState({ currentWeekBest })

    this._subscribe();
    this.updateData(currentWeekDay);
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

//Call redux to update DB at midnight
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
 
        if(idArr===2 && currentWeekDay===0){
          reduxProps.removeData({id:idArr[0]});
        }
        if(idArr.length===0 && currentWeekDay===0){
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
    // console.log('********', this.state.currentWeekBest)
    const totalSteps = this.state.currentStepCount+this.state.pastStepCount;
    const { isFontLoaded1, isFontLoaded2, isFontLoaded3 } = this.state;
    return (
      <View style={styles.container}>
        <StatusBar hidden={ true }/>

        <View style={styles.chart}>
            <View style={{height:'70%',width:'95%',marginLeft: 'auto',marginRight: 'auto',flexDirection:'row',marginTop:'2%',backgroundColor:'grey'}}>
                
            </View>
            <View style={{height:'30%',width:'95%',marginLeft: 'auto',marginRight: 'auto',flexDirection:'row',alignItems: 'center'}}>
                {['S','M','T','W','T','F','S'].map((day,index)=>{
                  if(this.state.currentWeekBest.step>0&&this.state.currentWeekBest.step>=totalSteps&&this.state.currentWeekBest.date===index){
                    return(
                      <View key={index} style={[styles.dayIcon,{marginLeft: index===0?'8%':'0%'}]}>
                      <Text key={index+1} style={[isFontLoaded3&&{fontFamily:'AvenirNextDemiItalic',fontSize:20}]}> </Text>
                        <TouchableOpacity key={index} style={{height:'40%',width:'65%',borderRadius:100,backgroundColor:'black',alignItems: 'center',justifyContent: 'center'}}>
                          <Text key={index} style={[isFontLoaded3&&{fontFamily:'AvenirNextDemiItalic',color:'white',fontSize:20,marginTop:'20%'}]}>{day}</Text>
                        </TouchableOpacity>
                      </View>
                    )
                  }
                  if(this.state.currentWeekBest.step<totalSteps&&this.state.currentWeekDay===index){
                    return(
                      <View key={index} style={[styles.dayIcon,{marginLeft: index===0?'8%':'0%'}]}>
                        <Text key={index+1} style={[isFontLoaded3&&{fontFamily:'AvenirNextDemiItalic',color:'black',fontSize:20,marginLeft:'5%'}]}>Today</Text>
                        <TouchableOpacity key={index} style={{height:'40%',width:'65%',borderRadius:100,backgroundColor:'black',alignItems: 'center',justifyContent: 'center'}}>
                          <Text key={index} style={[isFontLoaded3&&{fontFamily:'AvenirNextDemiItalic',color:'white',fontSize:20,marginTop:'20%'}]}>{day}</Text>
                        </TouchableOpacity>
                      </View>
                    )
                  }
                  else if(this.state.currentWeekDay===index&&this.state.currentWeekBest.step>=totalSteps){
                    return(
                      <View key={index} style={[styles.dayIcon,{marginLeft: index===0?'8%':'0%'}]}>
                        <Text key={index+1} style={[isFontLoaded3&&{fontFamily:'AvenirNextDemiItalic',color:'#cccccc',fontSize:20,marginLeft:'5%'}]}>Today</Text>
                        <TouchableOpacity key={index} style={{height:'40%',width:'65%',borderRadius:100,backgroundColor:'#cccccc',alignItems: 'center',justifyContent: 'center'}}>
                          <Text key={index} style={[isFontLoaded3&&{fontFamily:'AvenirNextDemiItalic',color:'black',fontSize:20,marginTop:'20%'}]}>{day}</Text>
                        </TouchableOpacity>
                      </View>
                    )
                  }else{
                    return(
                      <View key={index} style={[styles.dayIcon,{marginLeft: index===0?'8%':'0%'}]}>
                      <Text key={index+1} style={[isFontLoaded3&&{fontFamily:'AvenirNextDemiItalic',fontSize:20}]}> </Text>
                        <TouchableOpacity key={index} style={{height:'40%',width:'65%',borderRadius:100,alignItems: 'center',justifyContent: 'center'}}>
                          <Text key={index} style={[isFontLoaded3&&{fontFamily:'AvenirNextDemiItalic',color:'black',fontSize:20,marginTop:'20%'}]}>{day}</Text>
                        </TouchableOpacity>
                      </View>
                    )
                  }
                  
                })}
            </View>
        </View>
        <View style={styles.infoBar}>

        </View>
        <View style={styles.circle}>

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
    height: '100%',
    width: '100%', 
    alignItems: 'center',
    // justifyContent: 'center',
    // backgroundColor:'grey'
  },
  chart: {
    height: '35%',
    width: '100%', 
    alignItems: 'center'
  },
  dayIcon: {
    alignItems: 'center',
    height:'100%',
    width:'12%'
  },
  infoBar: {
    height: '10%',
    width: '100%', 
    alignItems: 'center',
    // backgroundColor:'grey'
  },
  circle: {
    height: '55%',
    width: '100%', 
    alignItems: 'center'
  }
});

Expo.registerRootComponent(App);
export default connect(mapState,mapDispatch)(App);
