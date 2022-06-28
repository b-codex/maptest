import { Input, Button, Select, Modal, Form, DatePicker, InputNumber, Row, message, Space, Tooltip } from 'antd';

import React, { useState } from 'react';
import { Layout } from 'antd';

import { addADS } from '../firebase/firebase_functions';

const { Sider } = Layout;
const { Option } = Select;


const Add_ads_component = ({ clickedLat, clickedLng, getData, setLocations }) => {

    const log = console.log;

    const [addModalVisible, setAddModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [isDateDisabled, setIsDateDisabled] = useState(true);

    const handleAvailability = (value) => {
        if (value === "occupied") {
            setIsDateDisabled(false);
        }
        else {
            setIsDateDisabled(true);
        }
    };

    const getCoordinatesFromCurrentLocation = async () => {
        setLoading(true);
        // get location from browser geolocation
        navigator.geolocation.getCurrentPosition(function (position) {
            form.setFieldsValue({
                lat: position.coords.latitude.toFixed(4),
                lng: position.coords.longitude.toFixed(4),
            });
            setLoading(false);
        });
    }

    const getCoordinatesFromClickedLocation = () => {
        form.setFieldsValue({
            lat: clickedLat,
            lng: clickedLng,
        });
    }

    const success = () => {
        message.success('Advertisement added successfully');
    };

    const error = () => {
        message.error('Something went wrong. Please Try Again.');
    };

    const formFailed = () => {
        message.error('Please Make Sure All Fields Are Filled');
    };

    const onFinish = async (values) => {
        setLoading(true);
        const latitude = values.lat;
        const longitude = values.lng;
        const sub_city = values.sub_city.toLowerCase();
        const price = values.price;
        const surface = values.surface;
        const type = values.type;
        const duration = values.duration;
        const availability = values.availability;
        const date = values.date.format('LL').toString();

        const response = await addADS(latitude, longitude, sub_city, price, surface, type, duration, availability, date);

        if (response === undefined) {
            setAddModalVisible(false);
            success();
            form.resetFields();
            setLoading(false);
            getData(setLocations);
        } else {
            error();
            setLoading(false);
        }

    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
        formFailed();
    };

    return (
        <>
            {/* add */}
            <Sider
                width={330}
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
                        height: '4.97vh',
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
                        style={
                            {
                                width: '100%',
                                height: '100%',
                            }
                        }
                    >
                        <Row align='center' style={
                            {
                                marginTop: '10px',
                                marginBottom: '20px',
                            }
                        }>
                            <Space size={'large'}>
                                <Tooltip title="Get Coordinates From Clicked Location">
                                    <Button type='primary' ghost onClick={getCoordinatesFromClickedLocation}>
                                        Use Clicked Location
                                    </Button>
                                </Tooltip>

                                <Tooltip title="Get Coordinates From Current Location">
                                    <Button type='primary' ghost onClick={getCoordinatesFromCurrentLocation} loading={loading}>
                                        Use Current Location
                                    </Button>
                                </Tooltip>
                            </Space>
                        </Row>

                        <Form.Item
                            label="Lat"
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
                            label="Lng"
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
                            <Select style={{ width: '100%' }} >
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
                            <InputNumber addonAfter="Birr" style={{ width: '100%' }} />
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
                            <InputNumber addonAfter="m²" style={{ width: '100%' }} />
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
                            <Select style={{ width: '100%' }} >
                                <Option value="ground">Ground</Option>
                                <Option value="building">Building</Option>
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
                            <InputNumber addonAfter="Days" style={{ width: '100%' }} />
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
                            <Select style={{ width: '100%' }} onChange={handleAvailability}>
                                <Option value="occupied">Occupied</Option>
                                <Option value="unoccupied">Unoccupied</Option>
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
                            <DatePicker
                                disabled={isDateDisabled}
                                // format="YYYY-MM-DD"
                                // format="MM-DD-YYYY"
                                format="MMMM Do, YYYY"
                                style={{ width: '100%' }}
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

        </>
    );
}

export default Add_ads_component;
