import React from 'react';
import { MapView } from 'expo';
import generatedMapStyle from '../mapStyle';
import { Text, View, StatusBar } from 'react-native';

export default class Map extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            mapRegion: {
                latitude: 40.748433,
                longitude: -73.985656,
                latitudeDelta: 0.0422,
                longitudeDelta: 0.7000,
              },
              location: { coords:{ latitude: 40.748433, longitude: -73.985656 }
                },
              locationResult: null
            }
    }

    _handleMapRegionChange = mapRegion => {
        this.setState({ mapRegion });
      };
    
    //Get user location  
      _getLocationAsync = async()=>{
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if(status !=='granted'){
          this.setState({
            locationResult: 'Permission to access location was denied',
            location,
          });
        }
        let location = await Location.getCurrentPositionAsync({});
        this.setState({ locationResult: JSON.stringify(location), location })
      }

    render() {
        return (
            
            <MapView
            style={{ alignSelf:'stretch', height: 305, width: '100%' }}
            provider = { MapView.PROVIDER_GOOGLE }
            customMapStyle = { generatedMapStyle }
            region={this.state.mapRegion}
            maxZoomLevel = {15}
            rotateEnabled = {true}
            // showUserLocation = {true}
            // userLocationAnnotationTitle = 'your are here!'
            onRegionChangeComplete={this._handleMapRegionChange}
            >
            {/* <MapView.Marker
            coordinate={this.state.location.coords}
            followsUserLocation = {true}
            image={require('../../public/marker.png')}
            title='You are here'
            /> */}
            </MapView>
        )
    }
}

Expo.registerRootComponent(Map);