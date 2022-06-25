import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax

import { Input, Collapse, Button, List, Select, Modal, Form, DatePicker, Slider, InputNumber, Col, Row, message } from 'antd';

import React, { useRef, useEffect, useState } from 'react';

import "antd/dist/antd.css";
import { Layout, Card } from 'antd';

import { addADS } from './firebase/firebase_functions';

const { Content, Sider } = Layout;
const { Search } = Input;
const { Panel } = Collapse;
const { Option } = Select;
const { RangePicker } = DatePicker;

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

  const [clickedLat, setClickedLat] = useState(0);
  const [clickedLng, setClickedLng] = useState(0);

  const [locations, setLocations] = useState([]);
  const [addModalVisible, setAddModalVisible] = useState(false);

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  var results = []
  const log = console.log;

  const [isDateDisabled, setIsDateDisabled] = useState(true);
  const [priceMin, setPriceMin] = useState(1000);
  const [priceMax, setPriceMax] = useState(10000);

  const handlePriceMin = (value) => {
    setPriceMin(value);
  }

  const handlePriceMax = (value) => {
    setPriceMax(value);
  }

  const handlePriceSlider = (value) => {
    setPriceMin(value[0]);
    setPriceMax(value[1]);
  }

  const [surfaceMin, setSurfaceMin] = useState(1);
  const [surfaceMax, setSurfaceMax] = useState(1000);

  const handleSurfaceMin = (value) => {
    setSurfaceMin(value);
  }

  const handleSurfaceMax = (value) => {
    setSurfaceMax(value);
  }

  const handleSurfaceSlider = (value) => {
    setSurfaceMin(value[0]);
    setSurfaceMax(value[1]);
  }

  const [durationMin, setDurationMin] = useState(1);
  const [durationMax, setDurationMax] = useState(100);

  const handleDurationMin = (value) => {
    setDurationMin(value);
  }

  const handleDurationMax = (value) => {
    setDurationMax(value);
  }

  const handleDurationSlider = (value) => {
    setDurationMin(value[0]);
    setDurationMax(value[1]);
  }

  const onSearch = async (value) => {

    const responses = await fetch('https://api.mapbox.com/geocoding/v5/mapbox.places/' + value + '.json?access_token=pk.eyJ1IjoieGNhZ2U3IiwiYSI6ImNsNGlrbTc0bTBmajgzY3BmNHA1NDVwMmYifQ.SrIHjoAhw8wWViQsLfjmUQ')
      .then(response => {
        return response.json();
      })

    setLocations(responses.features);
  };

  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };

  const handleAvailability = (value) => {
    if (value === "Occupied") {
      setIsDateDisabled(false);
    }
    else {
      setIsDateDisabled(true);
    }

  };

  const success = () => {
    message.success('Advertisement added successfully');
  };

  const error = () => {
    message.error('Something went wrong. Please Try Again.');
  };

  const onFinish = async (values) => {
    setLoading(true);
    // console.log('Success:', values.date[0]['_d']);
    const latitude = values.lat;
    const longitude = values.lng;
    const sub_city = values.sub_city;
    const price = values.price;
    const surface = values.surface;
    const type = values.type;
    const duration = values.duration;
    const availability = values.availability;
    const startDate = values.date[0]['_d'];
    const endDate = values.date[1]['_d'];
    const response = await addADS(latitude, longitude, sub_city, price, surface, type, duration, availability, startDate, endDate);
    // log(response);
    if (response === undefined) {
      setAddModalVisible(false);
      success();
      form.resetFields();
      setLoading(false);
    } else {
      error();
      setLoading(false);
    }

  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  useEffect(() => {
    // get location from browser geolocation
    // navigator.geolocation.getCurrentPosition(function (position) {
    //   setLat(position.coords.latitude);
    //   setLng(position.coords.longitude);
    //   setILat(position.coords.latitude);
    //   setILng(position.coords.longitude);
    // });

    setLat(9.00722);
    setLng(38.70694);

    setILat(9.00722);
    setILng(38.70694);

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
      var xLng = location.center[0];
      var xLat = location.center[1];
      // console.log(location);
      // console.log(xLat, xLng);

      // a popup will show with information about the marker
      var popup = new mapboxgl.Popup({ offset: 25, closeOnClick: true, closeButton: false })
        .setHTML(
          '<h3>' + location.place_name + '</h3>' +
          '<p>' + location.center[0] + ',' + location.center[1] + '</p>'
          // '<p>' + location.properties.address + '</p>' 
        );

      // create the marker
      new mapboxgl.Marker()
        .setLngLat([xLng, xLat])
        .setPopup(popup)
        .addTo(map);

    });

    // set map object
    setMap(map);
  }, [lat, lng, zoom, locations]);

  return (

    <Layout>

      {/* top side bar */}

      <Sider
        width={300}
        style={{
          overflow: 'auto',
          height: '5vh',
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
        {/* Button to add ads */}
        <Button
          width={300}
          type="primary"
          onClick={() => setAddModalVisible(true)}
          style={{
            height: '4vh',
            width: '100%',
            borderRadius: '0px',
            border: '0px',
          }}
        >
          Add Your Advertisement
        </Button>

        <Modal
          title="Add Advertisement"
          centered
          visible={addModalVisible}
          onOk={() => setAddModalVisible(false)}
          onCancel={() => setAddModalVisible(false)}
          footer={null}
        >
          <Form
            form={form}
            name="add_ads"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="Latitude"
              name="lat"
              rules={[
                {
                  required: true,
                  message: 'Latitude Required',
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Longitude"
              name="lng"
              rules={[
                {
                  required: true,
                  message: 'Longitude Required',
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Sub-city"
              name="sub_city"
              rules={[
                {
                  required: true,
                  message: 'Sub-city Required',
                },
              ]}
            >
              <Select defaultValue="Select One" style={{ width: '100%' }} onChange={handleChange}>
                <Option value="Addis Ketema">Addis Ketema</Option>
                <Option value="Akaki Kaliti">Akaki Kaliti</Option>
                <Option value="Arada">Arada</Option>
                <Option value="Bole">Bole</Option>
                <Option value="Gullele">Gullele</Option>
                <Option value="Kirkos">Kirkos</Option>
                <Option value="Kolfe Keranio">Kolfe Keranio</Option>
                <Option value="Lideta">Lideta</Option>
                <Option value="Nifas Silk Lafto">Nifas Silk Lafto</Option>
                <Option value="Yeka">Yeka</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Price"
              name="price"
              rules={[
                {
                  required: true,
                  message: 'Price Required',
                },
              ]}
            >
              <Input addonAfter="Birr" />
            </Form.Item>

            <Form.Item
              label="Surface"
              name="surface"
              rules={[
                {
                  required: true,
                  message: 'Surface Required',
                },
              ]}
            >
              <Input addonAfter="m²" />
            </Form.Item>

            <Form.Item
              label="Type"
              name="type"
              rules={[
                {
                  required: true,
                  message: 'Type Required',
                },
              ]}
            >
              <Select initialValues="Select One" style={{ width: '100%' }} onChange={handleChange}>
                <Option value="Ground">Ground</Option>
                <Option value="Building">Building</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Duration"
              name="duration"
              rules={[
                {
                  required: true,
                  message: 'Duration Required',
                },
              ]}
            >
              <Input addonAfter="Days" />
            </Form.Item>

            <Form.Item
              label="Availability"
              name="availability"
              rules={[
                {
                  required: true,
                  message: 'Availability Required',
                },
              ]}
            >
              <Select initialValues="Select One" style={{ width: '100%' }} onChange={handleAvailability}>
                <Option value="Occupied">Occupied</Option>
                <Option value="Unoccupied">Unoccupied</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Date"
              name="date"
              rules={[
                {
                  required: true,
                  message: 'Date Required',
                },
              ]}
            >
              <RangePicker
                disabled={isDateDisabled}
                format="YYYY-MM-DD"
              />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 11, span: 16 }}>
              <Button type="primary" htmlType="submit" loading={loading}>
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </Sider>

      {/* mid side bar */}
      <Sider
        width={300}
        style={{
          overflow: 'auto',
          height: '35vh',
          position: 'fixed',
          top: '5vh',
          left: 0,
          backgroundColor: '#fff',
          borderRight: '1px solid #e8e8e8',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
          zIndex: '10',
          padding: '0px',
          margin: '0px',
        }}
      >

        {/* <Menu items={items} /> */}
        <Search
          placeholder="Search"
          allowClear
          enterButton
          size="medium"
          onSearch={onSearch}
        />

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
      </Sider>

      {/* bottom side bar */}
      <Sider
        width={300}
        style={{
          overflow: 'auto',
          height: '56.5vh',
          position: 'fixed',
          top: '40vh',
          left: 0,
          backgroundColor: '#fff',
          borderRight: '1px solid #e8e8e8',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
          zIndex: '10',
          padding: '0px',
          margin: '0px',
        }}
      >
        <Card
          title="Filter Options"
          bordered={false}
          extra={
            <Button type="primary" size="small" ghost>
              Reset
            </Button>
          }>
          <Collapse accordion>

            <Panel header="Sub-city" key="1">
              <Select defaultValue="Select One" style={{ width: '100%' }} onChange={handleChange}>
                <Option value="Addis Ketema">Addis Ketema</Option>
                <Option value="Akaki Kaliti">Akaki Kaliti</Option>
                <Option value="Arada">Arada</Option>
                <Option value="Bole">Bole</Option>
                <Option value="Gullele">Gullele</Option>
                <Option value="Kirkos">Kirkos</Option>
                <Option value="Kolfe Keranio">Kolfe Keranio</Option>
                <Option value="Lideta">Lideta</Option>
                <Option value="Nifas Silk Lafto">Nifas Silk Lafto</Option>
                <Option value="Yeka">Yeka</Option>
              </Select>
            </Panel>

            <Panel header="Price" key="2">
              <Input.Group >
                <Row>
                  {/* <Space direction='horizontal'> */}
                  <Col span={12}>
                    <InputNumber placeholder="Min" name='priceMin' value={priceMin} onChange={handlePriceMin} addonAfter="Birr" />
                  </Col>
                  <Col span={12}>
                    <InputNumber placeholder="Max" name='priceMax' value={priceMax} onChange={handlePriceMax} addonAfter="Birr" />
                  </Col>
                  {/* </Space> */}
                </Row>
              </Input.Group>
              <Slider
                range={{ draggableTrack: true }}
                defaultValue={[priceMin, priceMax]}
                min={1}
                max={10000}
                onChange={handlePriceSlider}
              />
            </Panel>

            <Panel header="Surface" key="3">
              <Input.Group >
                <Row>
                  {/* <Space direction='horizontal'> */}
                  <Col span={12}>
                    <InputNumber placeholder="Min" name='surfaceMin' value={surfaceMin} onChange={handleSurfaceMin} addonAfter="m²" />
                  </Col>
                  <Col span={12}>
                    <InputNumber placeholder="Max" name='surfaceMax' value={surfaceMax} onChange={handleSurfaceMax} addonAfter="m²" />
                  </Col>
                  {/* </Space> */}
                </Row>
              </Input.Group>
              <Slider
                range={{ draggableTrack: true }}
                defaultValue={[surfaceMin, surfaceMax]}
                min={1}
                max={1000}
                onChange={handleSurfaceSlider}
              />
            </Panel>

            <Panel header="Type" key="4">
              <Select defaultValue="Select One" style={{ width: '100%' }} onChange={handleChange}>
                <Option value="Ground">Ground</Option>
                <Option value="Building">Building</Option>
              </Select>
            </Panel>

            <Panel header="Duration" key="5">
              <Input.Group >
                <Row>
                  {/* <Space direction='horizontal'> */}
                  <Col span={12}>
                    <InputNumber placeholder="Min" name='durationMin' value={durationMin} onChange={handleDurationMin} addonAfter="m²" />
                  </Col>
                  <Col span={12}>
                    <InputNumber placeholder="Max" name='durationMax' value={durationMax} onChange={handleDurationMax} addonAfter="m²" />
                  </Col>
                  {/* </Space> */}
                </Row>
              </Input.Group>
              <Slider
                range={{ draggableTrack: true }}
                defaultValue={[durationMin, durationMax]}
                min={1}
                max={100}
                onChange={handleDurationSlider}
              />
            </Panel>

            <Panel header="Availability" key="6">
              <Select defaultValue="Select One" style={{ width: '100%' }} onChange={handleChange}>
                <Option value="Occupied">Occupied</Option>
                <Option value="Unoccupied">Unoccupied</Option>
              </Select>
            </Panel>

          </Collapse>
        </Card>


      </Sider>

      {/* map clicked location */}
      <Sider
        width={300}
        style={{
          overflow: 'auto',
          height: '3.5vh',
          position: 'fixed',
          top: '96.5vh',
          left: 0,
          backgroundColor: '#fff',
          borderRight: '1px solid #e8e8e8',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
          zIndex: '10',
          padding: '0px',
          margin: '0px',
        }}
      >
        <Input value={`Lng: ${clickedLng}, Lat: ${clickedLat}`} contentEditable={false} />
      </Sider>

      <Layout>
        {/* <Header
          style={{
            height: '10vh',
            background: '#fff',
            padding: 0,
            margin: '0px',
            borderBottom: '1px solid #e8e8e8',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
          }}
        >
          Header
        </Header> */}
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
    </Layout >

  );
}

