import React, { useState } from 'react';

import { Input, Collapse, Button, Select, Form, Slider, InputNumber, Col, Row, message } from 'antd';

import { Layout, Card } from 'antd';

import { getDocs, query, where } from 'firebase/firestore';
import { housesCollection } from '../firebase/firebase_functions';

const { Panel } = Collapse;
const { Option } = Select;

const Filter_Component = ({ setLocations, resetMap }) => {

    const log = console.log;

    const [loading, setLoading] = useState(false);

    const { Sider } = Layout;

    const [priceMin, setPriceMin] = useState(10000);
    const [priceMax, setPriceMax] = useState(100000);

    const [surfaceMin, setSurfaceMin] = useState(1);
    const [surfaceMax, setSurfaceMax] = useState(1000);

    const [durationMin, setDurationMin] = useState(1);
    const [durationMax, setDurationMax] = useState(100);

    const [form] = Form.useForm();

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

    const onFilter = async (value, fl) => {

        setLoading(true);

        // get data from collection
        const q = query(housesCollection, where(fl, '==', value.toLowerCase()));
        const responses = await getDocs(q).then(data => {
            let houses = [];
            data.docs.forEach(doc => {
                houses.push({ ...doc.data(), id: doc.id });
            }
            );
            return houses;
        }
        ).catch(err => {
            log(err);
        }
        );

        if (responses.length === 0) {
            setLoading(false);
            info();
            setLocations([]);
        }
        else {
            setLocations(responses);
            setLoading(false);
        }
    };

    const onFilterRange = async (fl, min, max) => {

        setLoading(true);
        log('min: ' + min + ' max: ' + max);
        // get data from collection
        const q = query(housesCollection, where(fl, '>=', min), where(fl, '<=', max));
        const responses = await getDocs(q).then(data => {
            let houses = [];
            data.docs.forEach(doc => {
                houses.push({ ...doc.data(), id: doc.id });
            }
            );
            return houses;
        }
        ).catch(err => {
            log(err);
        }
        );
        if (responses.length === 0) {
            info();
            setLocations([]);
            setLoading(false);
        }
        else {
            setLocations(responses);
            setLoading(false);
        }
    };

    const info = () => {
        message.info('No advertisements found');
    };

    const error = () => {
        message.error('Something went wrong. Please Try Again.');
    };

    const filterBySubCity = (value) => {
        onFilter(value, 'sub_city');
    }

    const filterByType = (value) => {
        onFilter(value, 'type');
    }

    const filterByAvailability = (value) => {
        onFilter(value, 'availability');
    }

    const filterByPrice = () => {
        onFilterRange('price', priceMin, priceMax);
    }

    const filterBySurface = () => {
        onFilterRange('surface', surfaceMin, surfaceMax);
    }

    const filterByDuration = () => {
        onFilterRange('duration', durationMin, durationMax);
    }
    return (
        <>
            {/* filters */}
            <Sider
                width={330}
                style={{
                    overflow: 'auto',
                    height: '55vh',
                    position: 'fixed',
                    top: '45vh',
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
                        <Button type="primary" size="medium" ghost danger onClick={resetMap}>
                            Reset
                        </Button>
                    }>
                    <Collapse accordion>

                        <Panel header="Sub-city" key="1">
                            <Select style={{ width: '100%' }} onChange={filterBySubCity}>
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

                        <Panel header="Price (Birr)" key="2">
                            <Input.Group >
                                <Row>
                                    {/* <Space direction='horizontal'> */}
                                    <Col span={12}>
                                        <InputNumber placeholder="Min" name='priceMin' value={priceMin} onChange={handlePriceMin} />
                                    </Col>
                                    <Col span={12}>
                                        <InputNumber placeholder="Max" name='priceMax' value={priceMax} onChange={handlePriceMax} />
                                    </Col>
                                    {/* </Space> */}
                                </Row>
                            </Input.Group>
                            <Slider
                                range={{ draggableTrack: true }}
                                defaultValue={[priceMin, priceMax]}
                                min={1}
                                max={1000000}
                                value={[priceMin, priceMax]}
                                onChange={handlePriceSlider}
                            />
                            <Row align='center'>
                                <Button type='primary' onClick={filterByPrice}>Apply</Button>
                            </Row>
                        </Panel>

                        <Panel header="Surface (m²)" key="3">
                            <Input.Group >
                                <Row>
                                    {/* <Space direction='horizontal'> */}
                                    <Col span={12}>
                                        <InputNumber placeholder="Min" name='surfaceMin' value={surfaceMin} onChange={handleSurfaceMin} />
                                    </Col>
                                    <Col span={12}>
                                        <InputNumber placeholder="Max" name='surfaceMax' value={surfaceMax} onChange={handleSurfaceMax} />
                                    </Col>
                                    {/* </Space> */}
                                </Row>
                            </Input.Group>
                            <Slider
                                range={{ draggableTrack: true }}
                                defaultValue={[surfaceMin, surfaceMax]}
                                min={1}
                                max={1000}
                                value={[surfaceMin, surfaceMax]}
                                onChange={handleSurfaceSlider}
                            />
                            <Row align='center'>
                                <Button type='primary' onClick={filterBySurface}>Apply</Button>
                            </Row>
                        </Panel>

                        <Panel header="Type" key="4">
                            <Select style={{ width: '100%' }} onChange={filterByType}>
                                <Option value="Ground">Ground</Option>
                                <Option value="Building">Building</Option>
                            </Select>
                        </Panel>

                        <Panel header="Duration (Days)" key="5">
                            <Input.Group >
                                <Row>
                                    {/* <Space direction='horizontal'> */}
                                    <Col span={12}>
                                        <InputNumber placeholder="Min" name='durationMin' value={durationMin} onChange={handleDurationMin} />
                                    </Col>
                                    <Col span={12}>
                                        <InputNumber placeholder="Max" name='durationMax' value={durationMax} onChange={handleDurationMax} />
                                    </Col>
                                    {/* </Space> */}
                                </Row>
                            </Input.Group>
                            <Slider
                                range={{ draggableTrack: true }}
                                defaultValue={[durationMin, durationMax]}
                                min={1}
                                max={100}
                                value={[durationMin, durationMax]}
                                onChange={handleDurationSlider}
                            />
                            <Row align='center'>
                                <Button type='primary' onClick={filterByDuration}>Apply</Button>
                            </Row>
                        </Panel>

                        <Panel header="Availability" key="6">
                            <Select style={{ width: '100%' }} onChange={filterByAvailability}>
                                <Option value="Occupied">Occupied</Option>
                                <Option value="Unoccupied">Unoccupied</Option>
                            </Select>
                        </Panel>

                    </Collapse>
                </Card>


            </Sider>
        </>
    );
}

export default Filter_Component;
