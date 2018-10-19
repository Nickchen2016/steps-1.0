import React from 'react';
import { MapView } from 'expo';
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

const generatedMapStyle = [
    {
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#f5f5f5"
        }
      ]
    },
    {
      "elementType": "labels.icon",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#616161"
        }
      ]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#f5f5f5"
        }
      ]
    },
    {
      "featureType": "administrative.land_parcel",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#bdbdbd"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#eeeeee"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "featureType": "poi.business",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#e5e5e5"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#9e9e9e"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#ffffff"
        }
      ]
    },
    {
      "featureType": "road.arterial",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#dadada"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#616161"
        }
      ]
    },
    {
      "featureType": "road.local",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#9e9e9e"
        }
      ]
    },
    {
      "featureType": "transit.line",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#e5e5e5"
        }
      ]
    },
    {
      "featureType": "transit.station",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#eeeeee"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#c9c9c9"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#9e9e9e"
        }
      ]
    }
  ]