import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax

import React, { useRef, useEffect, useState } from 'react';

import "antd/dist/antd.css";
import { Layout } from 'antd';

import { getData } from './firebase/firebase_functions';

import Filter_Component from './components/filter_component';
import Add_ads_component from './components/add_ads_component';
import Search_Component from './components/search_component';

const { Content } = Layout;

mapboxgl.accessToken = 'pk.eyJ1IjoieGNhZ2U3IiwiYSI6ImNsNGlrbTc0bTBmajgzY3BmNHA1NDVwMmYifQ.SrIHjoAhw8wWViQsLfjmUQ';

export default function App() {

  const log = console.log;

  const mapContainer = useRef(null);
  // const map = useRef(null);
  const [mapObject, setMap] = useState();

  const [lng, setLng] = useState(0);
  const [lat, setLat] = useState(0);
  const [zoom, setZoom] = useState(0);

  const [clickedLat, setClickedLat] = useState(0);
  const [clickedLng, setClickedLng] = useState(0);

  const [locations, setLocations] = useState([]);

  // get data when the page loads
  useEffect(() => {
    // onSnapshot(housesCollection, (snapshot) => {
    //   snapshot.docs.forEach(doc => {
    //     // setAds({ ...doc.data(), id: doc.id });
    //     x.push({ ...doc.data(), id: doc.id });
    //   }
    //   );
    // })
    

    setLat(9.00722);
    setLng(38.78694);

    setZoom(11);

    getData({ setLocations });
  }, []);

  // init map when the page loads
  useEffect(() => {


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

    // add marker to get custom location selected by the user
    map.on('click', function (e) {
      // new mapboxgl.Marker({ draggable: true, })
      //   .setLngLat(e.lngLat)
      //   .addTo(map);
      setClickedLng(e.lngLat.lng.toFixed(5));
      setClickedLat(e.lngLat.lat.toFixed(5));
    });

    // adding markers
    locations.map(location => {
      var xLng = location.longitude;
      var xLat = location.latitude;
      // console.log(location);
      // console.log(xLat, xLng);

      // a popup will show with information about the marker
      var popup = new mapboxgl.Popup({ offset: 25, closeOnClick: true, closeButton: false })
        .setHTML(
          '<p> Category: ' + location.category[0].toUpperCase() + location.category.substring(1) + '</p>' +
          '<p> Sub-city: ' + location.sub_city[0].toUpperCase() + location.sub_city.substring(1) + '</p>' +
          '<p> Price: ' + location.price + ' Birr</p>' +
          '<p> Surface: ' + location.surface + ' m²</p>' +
          '<p> Type: ' + location.type[0].toUpperCase() + location.type.substring(1) + '</p>' +
          '<p> Duration: ' + location.duration + ' Days</p>' +
          '<p> Availability: ' + location.availability[0].toUpperCase() + location.availability.substring(1) + '</p>'
          // '<p>' + location.properties.address + '</p>' 
        );

      let color = '';
      if (location.availability === "occupied") {
        color = '#ff0000'; //red
      }
      if (location.availability === "unoccupied") {
        color = '#00ff00'; //green
      }

      // create the marker
      new mapboxgl.Marker({ color: color })
        .setLngLat([xLng, xLat])
        .setPopup(popup)
        .addTo(map);

    });

    // set map object
    setMap(map);
  }, [lat, lng, zoom, locations]);

  //  async function filterMap(search, q) {
  //   if (search !== '') {
  //     if (q.toLowerCase() === 'sub_city') {
  //       // await getData();
  //       setLocations(locations.filter(location => location.sub_city.toLowerCase().includes(search.toLowerCase())));
  //     }

  //     if (q.toLowerCase() === 'type') {
  //       setLocations(locations.filter(location => location.type.toLowerCase().includes(search.toLowerCase())));
  //     }

  //     if (q.toLowerCase() === 'availability') {
  //       setLocations(locations.filter(location => location.availability.toLowerCase().includes(search.toLowerCase())));
  //     }


  //   }
  // }
  //search from the map
  // useEffect(() => {
  // }, [search, locations]);

  //filter functions


  return (

    <Layout>

      <Add_ads_component
        clickedLat={clickedLat}
        clickedLng={clickedLng}
        getData={getData}
        setLocations={setLocations}
      />

      <Search_Component
        getData={getData}
        locations={locations}
        setLocations={setLocations}
        mapObject={mapObject}
      />

      <Filter_Component
        locations={locations}
        setLocations={setLocations}
      />

      {/* map coordinates */}
      <Layout>
        <Content
          style={{
            padding: '0px',
            margin: '0px',
            background: '#fff',
            height: '100vh',
            overflow: 'hidden',
            marginLeft: '330px',
          }}
        >
          <div>
            <div className="sidebar">
              Clicked Lat: {clickedLat} | Clicked Lng: {clickedLng}
            </div>
            <div ref={mapContainer} className="map-container" />
          </div>
        </Content>
      </Layout>
    </Layout >

  );
}

