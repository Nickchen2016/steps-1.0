import React from 'react';
import { Pedometer,Font } from 'expo';
import { AsyncStorage, StyleSheet, Text, View, StatusBar, Image, TouchableOpacity } from 'react-native';
import ColumnChart from './ColumnChart';
import Slide from './Slide';
import CircularChart from './CircularChart';
import ModalWindow from './ModalWindow';
import { connect } from 'react-redux';
import { createNewWeek, updateData, removeData } from '../redux/getData';
import { postRecord,patchRecord } from '../redux/getRecord';

class App extends React.Component {
  state = {
    isFontLoaded1: false,
    isFontLoaded2: false,
    isFontLoaded3: false,
    isPedometerAvailable: "checking",
    currentWeekDay:null,
    currentWeekData:[0,0,0,0,0,0,0],
    lastWeekData:[0,0,0,0,0,0,0],
    currentWeekBest:{},
    pastStepCount: 0,
    currentStepCount: 0,
    currentGoal:0
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
    const currentWeekDay = time.getDay();
    this.setState({currentWeekDay});

    this._subscribe();
    this.getWeekData(currentWeekDay);
    this.updateData(currentWeekDay);
    this.getCurrentGoal();
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

//Get current and last week's step data
  getWeekData=(currentWeekDay)=>{
    const currentWeekData = [0,0,0,0,0,0,0], lastWeekData = [0,0,0,0,0,0,0];
    AsyncStorage.getItem('data',(err,result)=>{
      let totalSteps = 0, data = JSON.parse(result);
      data.steps?totalSteps+=data.steps+data.steps2:totalSteps+=data.steps2;

      this.props.data&&this.props.data.length===2?this.props.data[0].dates.map(d=>lastWeekData[d.date]=d.steps):'';
      this.props.data&&this.props.data.length>0?this.props.data[this.props.data.length-1].dates.map(d=>currentWeekData[d.date]=d.steps):'';
      currentWeekData[currentWeekDay]=totalSteps;
      const currentweekBestStep = Math.max.apply(null,currentWeekData);
      const currentWeekBest = {date:currentWeekData.indexOf(currentweekBestStep),step:currentweekBestStep};
      this.setState({ currentWeekBest,currentWeekData,lastWeekData })
    })
  }

//Call redux to update DB at midnight
  updateData=(currentWeekDay)=>{
    const time = new Date();
    time.setHours(23,59,59,999);
    const milliseconds = time.getTime()-new Date().getTime();
    const MILLISECONDS_IN_A_DAY = 86400000;
    const idArr = [];
    this.props.data&&this.props.data.map(week=>idArr.push(week._id));
    let reduxProps = this.props;

    let postAtMidNight = setTimeout(function tick(){
      AsyncStorage.getItem('data',(err,result)=>{
        let totalSteps = 0, data = JSON.parse(result);
        data.steps?totalSteps+=data.steps+data.steps2:totalSteps+=data.steps2;
 
        if(idArr.length>=2 && currentWeekDay===0){
          reduxProps.removeData({id:idArr[0]});
        }
        if(idArr.length===0&&Object.key(reduxProps.record).length===0){
          reduxProps.postRecord({ data:totalSteps })
        }
        if(idArr.length===0 || currentWeekDay===0){
          reduxProps.createNewWeek({date:currentWeekDay,steps:totalSteps});
        }else{
          reduxProps.updateData({id:idArr[idArr.length-1],date:currentWeekDay,steps:totalSteps});
          if(totalSteps>reduxProps.record.data){
            reduxProps.patchRecord({ id:reduxProps.record._id,data:totalSteps })
          }
        }
      });
      
      postAtMidNight = setTimeout(tick,MILLISECONDS_IN_A_DAY)
    },milliseconds)
  }

//Get the next step goal
  getCurrentGoal = ()=> {
    let currentGoal = 0;
    if(this.props.record.data&&this.props.record.data.toString().length>4){
        currentGoal+=(Number(this.props.record.data.toString()[0])+1)*10000;
        this.setState({ currentGoal });
    }else{
        currentGoal+=10000;
        this.setState({ currentGoal });
    }
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
    // console.log('********', this.state.currentWeekData)
    const totalSteps = this.state.currentStepCount+this.state.pastStepCount;
    const { isFontLoaded1, isFontLoaded2, isFontLoaded3 } = this.state;
    return (
      <View style={styles.container}>
        <StatusBar hidden={ true }/>

        <View>
          <ModalWindow 
          currentGoal={this.state.currentGoal} 
          todaySteps={totalSteps}
          />
        </View>
        <View style={styles.chart}>
            <View style={{height:'72%',width:'80%',marginLeft: 'auto',marginRight: 'auto',flexDirection:'row'}}>
                <ColumnChart lastWeekData={this.state.lastWeekData} currentWeekData={this.state.currentWeekData} currentWeekBest={this.state.currentWeekBest} currentGoal={this.state.currentGoal}/>
            </View>
            <View style={{height:70,width:'95%',marginLeft: 'auto',marginRight: 'auto',flexDirection:'row',alignItems: 'center', marginTop:'2%'}}>
                {['S','M','T','W','T','F','S'].map((day,index)=>{
                  if(this.state.currentWeekBest.step>0&&this.state.currentWeekBest.step>=totalSteps&&this.state.currentWeekBest.date===index){
                    return(
                      <View key={index} style={[styles.dayIcon,{marginLeft: index===0?'8%':'0%'}]}>
                      <Text style={[isFontLoaded3&&{fontFamily:'AvenirNextDemiItalic',fontSize:18}]}> </Text>
                        <TouchableOpacity activeOpacity={1} style={{height:'38%',width:'65%',borderRadius:100,backgroundColor:'black',alignItems: 'center',justifyContent: 'center'}}>
                          <Text style={[isFontLoaded3&&{fontFamily:'AvenirNextDemiItalic',color:'white',fontSize:18,marginTop:'20%'}]}>{day}</Text>
                        </TouchableOpacity>
                      </View>
                    )
                  }
                  if(this.state.currentWeekBest.step<totalSteps&&this.state.currentWeekDay===index){
                    return(
                      <View key={index} style={[styles.dayIcon,{marginLeft: index===0?'8%':'0%'}]}>
                        <Text style={[isFontLoaded3&&{fontFamily:'AvenirNextDemiItalic',color:'black',fontSize:18,marginLeft:'5%'}]}>Today</Text>
                        <TouchableOpacity activeOpacity={1} style={{height:'38%',width:'65%',borderRadius:100,backgroundColor:'black',alignItems: 'center',justifyContent: 'center'}}>
                          <Text style={[isFontLoaded3&&{fontFamily:'AvenirNextDemiItalic',color:'white',fontSize:18,marginTop:'20%'}]}>{day}</Text>
                        </TouchableOpacity>
                      </View>
                    )
                  }
                  else if(this.state.currentWeekDay===index&&this.state.currentWeekBest.step>=totalSteps){
                    return(
                      <View key={index} style={[styles.dayIcon,{marginLeft: index===0?'8%':'0%'}]}>
                        <Text style={[isFontLoaded3&&{fontFamily:'AvenirNextDemiItalic',color:'#cccccc',fontSize:18,alignItems: 'center',justifyContent: 'center'}]}>Today</Text>
                        <TouchableOpacity activeOpacity={1} style={{height:'38%',width:'65%',borderRadius:100,backgroundColor:'#cccccc',alignItems: 'center',justifyContent: 'center'}}>
                          <Text style={[isFontLoaded3&&{fontFamily:'AvenirNextDemiItalic',color:'black',fontSize:18,marginTop:'20%'}]}>{day}</Text>
                        </TouchableOpacity>
                      </View>
                    )
                  }else{
                    return(
                      <View key={index} style={[styles.dayIcon,{marginLeft: index===0?'8%':'0%'}]}>
                      <Text style={[isFontLoaded3&&{fontFamily:'AvenirNextDemiItalic',fontSize:18}]}> </Text>
                        <TouchableOpacity activeOpacity={1} style={{height:'38%',width:'65%',borderRadius:100,alignItems: 'center',justifyContent: 'center'}}>
                          <Text style={[isFontLoaded3&&{fontFamily:'AvenirNextDemiItalic',color:'black',fontSize:18,marginTop:'20%'}]}>{day}</Text>
                        </TouchableOpacity>
                      </View>
                    )
                  }
                })}
            </View>
        </View>
        <View style={styles.infoBar}>
            <View style={styles.line}></View>
            <View style={{height:'98%',width:'100%'}}>
                <Slide currentWeekData={this.state.currentWeekData} todaySteps={totalSteps} currentGoal={this.state.currentGoal}/>
            </View>
            <View style={styles.line}></View>
        </View>
        <View style={styles.circle}>
            <CircularChart todaySteps={totalSteps} currentGoal={this.state.currentGoal}/>
        </View>
      </View>
    );
  }
}


const mapState = state => {
  return {
    data: state.getData,
    record: state.getRecord
  }
};
const mapDispatch = dispatch=>({
  createNewWeek: (credentials)=> dispatch(createNewWeek(credentials)),
  updateData: (credentials)=> dispatch(updateData(credentials)),
  removeData: (id)=> dispatch(removeData(id)),
  postRecord: (data)=> dispatch(postRecord(data)),
  patchRecord: (data)=> dispatch(patchRecord(data))
});

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%', 
    alignItems: 'center'
  },
  chart: {
    height: 250,
    width: '100%', 
    alignItems: 'center',
    marginTop:'1%'
  },
  dayIcon: {
    alignItems: 'center',
    height:'100%',
    width:'12%'
  },
  infoBar: {
    height: 70,
    width: '100%',
    alignItems: 'center',
    marginTop: '1%'
  },
  line: {
    height:.6,width:'90%',backgroundColor:'black'
  },
  circle: {
    height: '55%',
    width: '100%', 
    alignItems: 'center'
  }
});

Expo.registerRootComponent(App);
export default connect(mapState,mapDispatch)(App);
