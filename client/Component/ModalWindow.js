import React from 'react';
import { Text, View, StyleSheet,Image, TouchableOpacity } from 'react-native';
import { Font } from 'expo';
import Modal from 'react-native-modal';
import MedalSrc from './MedalSrc';
import { connect } from 'react-redux';

class ModalWindow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isFontLoaded1: false,
            isFontLoaded3: false,
            isModalVisible: false
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

    componentWillReceiveProps(nextProps){
        if(nextProps.todaySteps>=1220){
            this._toggleModal();
        }
    }

    _toggleModal = () =>{
            this.setState({ isModalVisible: !this.state.isModalVisible });
    }

    render() {
        const { isFontLoaded1,isFontLoaded3 } = this.state;
        return(
            <View style={styles.container} >
                        <Modal 
                            isVisible={this.state.isModalVisible} 
                            style={styles.modal}
                            transparent= {true}
                            backdropOpacity={.4}
                            animationType={'fade'}
                        >
                            <TouchableOpacity 
                                onPress={this._toggleModal} 
                                style={styles.innerView}
                            >
                                <Text style={isFontLoaded3&&{fontFamily:'AvenirNextDemiItalic',textAlign:'center',fontSize:26,lineHeight:30, marginTop:'5%'}}>Congratuation for your{"\n"}new record with  
                                    <Text style={isFontLoaded1&&{fontFamily:'AvenirNextHeavyCondensed',fontSize:26}}>{this.props.todaySteps}</Text>{"\n"}of steps in a day!
                                </Text>
                                <Image style={{width:60,height:60}} source={MedalSrc[this.props.currentGoal/10000-2]}/>
                            </TouchableOpacity>
                        </Modal>        
            </View>
        )
    }
}

const mapState = state =>{
    return {record: state.getRecord}
}

const styles = StyleSheet.create({
    container: {
        position:'absolute'
    },
    modal: {
        flex:0,height:200,marginTop:'50%',
        backgroundColor:'white',
        borderRadius: 20
    },
    innerView: {
        flexDirection: 'column',marginTop:'50%',
        height:200,
        alignItems:'center'
    }
})

export default connect(mapState)(ModalWindow);