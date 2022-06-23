import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax

import { Input, Menu, Space, List } from 'antd';

import React, { useRef, useEffect, useState } from 'react';

import "antd/dist/antd.css";
import { Layout, Card } from 'antd';

import { items } from './components/menu.items'

const { Content, Sider, Header } = Layout;
const { Search } = Input;

mapboxgl.accessToken = 'pk.eyJ1IjoieGNhZ2U3IiwiYSI6ImNsNGlrbTc0bTBmajgzY3BmNHA1NDVwMmYifQ.SrIHjoAhw8wWViQsLfjmUQ';

export default function App() {
  const mapContainer = useRef(null);
  // const map = useRef(null);
  const [mapObject, setMap] = useState();

  const [lng, setLng] = useState(0);
  const [lat, setLat] = useState(0);
  const [zoom, setZoom] = useState(0);

  const [ILng, setILng] = useState(0);
  const [ILat, setILat] = useState(0);

  const [locations, setLocations] = useState([]);

  const onSearch = async (value) => {

    const responses = await fetch('https://api.mapbox.com/geocoding/v5/mapbox.places/' + value + '.json?access_token=pk.eyJ1IjoieGNhZ2U3IiwiYSI6ImNsNGlrbTc0bTBmajgzY3BmNHA1NDVwMmYifQ.SrIHjoAhw8wWViQsLfjmUQ')
      .then(response => {
        return response.json();
      })

    setLocations(responses.features);
  };

  console.log(locations);

  useEffect(() => {
    // get location from browser geolocation
    // navigator.geolocation.getCurrentPosition(function (position) {
    //   setLat(position.coords.latitude);
    //   setLng(position.coords.longitude);
    // });

    setLat(9.00722)
    setILat(9.00722)
    
    setLng(38.75694);
    setILng(38.75694);

    setZoom(11);

    // init the map object
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: zoom,
    }, [lat, lng, zoom]);

    // get the current location of the user with a click of a button
    map.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        // When active the map will receive updates to the device's location as it changes.
        trackUserLocation: true,
        // Draw an arrow next to the location dot to indicate which direction the device is heading.
        showUserHeading: true
      })
    );

    // adding markers
    locations.map(location => {
      var xLng = location.center[0];
      var xLat = location.center[1];
      // console.log(xLat, xLng);
      new mapboxgl.Marker()
        .setLngLat([xLng, xLat])
        .addTo(map);
    });

    // set map object
    setMap(map);
  }, [lat, lng, zoom, locations]);

  return (

    <Layout>
      <Sider
        width={300}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          backgroundColor: '#fff',
          borderRight: '1px solid #e8e8e8',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
          zIndex: '10',
          padding: '0px',
          margin: '0px',
        }}
      >
        <Space>

          <Menu items={items} />
          <Search
            placeholder="search"
            allowClear
            enterButton="Search"
            size="medium"
            onSearch={onSearch}
          />

        </Space>

        <List
          size="large"
          dataSource={locations}
          renderItem={item =>
            <List.Item
              className='clickable'
              onClick={() => {

                // go to the location
                mapObject.flyTo({
                  center: [item.center[0], item.center[1]],
                  zoom: 15,
                  speed: 3,
                  curve: 1,
                  easing: function (t) {
                    return t;
                  }
                });

                setILng(item.center[0]);
                setILat(item.center[1]);
              }}
            >{item.place_name}
            </List.Item>
          }
        />
        {/* {
          locations.map(location => {
            console.log('location', location)
            return (

              <Card>
                <p>{location.place_name}</p>
              </Card>

            )
          })
        } */}



      </Sider>

      <Layout>
        <Header
          style={{
            background: '#fff',
            padding: 0,
            margin: '0px',
            borderBottom: '1px solid #e8e8e8',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
          }}
        >Header</Header>
        <Content>
          <div>
            <div className="sidebar">
              Lon: {ILng} | Lat: {ILat}
            </div>
            <div ref={mapContainer} className="map-container" />
          </div>
        </Content>
        {/* <Footer>Footer</Footer> */}
      </Layout>
    </Layout>

  );
}

