import { Form, Input, Button, Select, Slider, InputNumber, Col, Row, message, Divider, Space } from 'antd';
import React, { useState } from 'react'

import { getDocs, query, where } from 'firebase/firestore';
import { housesCollection, getData } from '../../firebase/firebase_functions';

const Filter_Form = ({ setLocations }) => {
    const log = console.log;

    const [loading, setLoading] = useState(false);

    const [priceMin, setPriceMin] = useState(1);
    const [priceMax, setPriceMax] = useState(1000000);

    const [surfaceMin, setSurfaceMin] = useState(1);
    const [surfaceMax, setSurfaceMax] = useState(10000);

    const [durationMin, setDurationMin] = useState(1);
    const [durationMax, setDurationMax] = useState(365);

    const [form] = Form.useForm();
    const { Option } = Select;

    const onFinish = async (values) => {
        setLoading(true);
        const { sub_city, price, surface, duration, type, availability } = values;
        const { priceMin, priceMax } = price;
        const { surfaceMin, surfaceMax } = surface;
        const { durationMin, durationMax } = duration;
        
        // const query = housesCollection.where('price', '>=', priceMin).where('price', '<=', priceMax);
        // const query2 = housesCollection.where('surface', '>=', surfaceMin).where('surface', '<=', surfaceMax);
        // const query3 = housesCollection.where('duration', '>=', durationMin).where('duration', '<=', durationMax);
        

        

        log(values);

        setLoading(false);
    }

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
        error();
    }

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

    //reset the search filters with a button
    const resetMap = () => {
        form.resetFields();
        // getData({ setLocations });
    }

    return (
        <>
            <Form
                layout="vertical"
                form={form}
                name="advanced_search"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
            >
                <Form.Item
                    label="Sub-city"
                    name="sub_city"
                >
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
                </Form.Item>

                <Divider />

                <Form.Item
                    label="Price (Birr)"
                    name="price"
                >
                    <Input.Group >
                        <Row
                            style={{
                                width: '100%',
                            }}
                        >
                            <Col span={12}>
                                <Form.Item
                                    name={['price', 'priceMin']}
                                    noStyle
                                // initialValue={priceMin}
                                >
                                    <InputNumber placeholder="Min" name="priceMin" value={priceMin} onChange={handlePriceMin} />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name={['price', 'priceMax']}
                                    noStyle
                                // initialValue={priceMax}
                                >
                                    <InputNumber placeholder="Max" name="priceMax" value={priceMax} onChange={handlePriceMax} />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Input.Group>
                    {/* <Slider
                        range={{ draggableTrack: true }}
                        defaultValue={[priceMin, priceMax]}
                        min={1}
                        max={1000000}
                        value={[priceMin, priceMax]}
                        onChange={handlePriceSlider}
                    /> */}
                    {/* <Row align='center'>
                        <Button type='primary' onClick={filterByPrice}>Apply</Button>
                    </Row> */}
                </Form.Item>

                <Divider />

                <Form.Item
                    label="Surface (m²)"
                    name="surface"
                >
                    <Input.Group >
                        <Row>
                            {/* <Space direction='horizontal'> */}
                            <Col span={12}>
                                <Form.Item
                                    name={['surface', 'surfaceMin']}
                                    noStyle
                                >
                                    <InputNumber placeholder="Min" value={surfaceMin} onChange={handleSurfaceMin} />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name={['surface', 'surfaceMax']}
                                    noStyle
                                >
                                    <InputNumber placeholder="Max" value={surfaceMax} onChange={handleSurfaceMax} />
                                </Form.Item>
                            </Col>
                            {/* </Space> */}
                        </Row>
                    </Input.Group>
                    {/* <Slider
                        range={{ draggableTrack: true }}
                        defaultValue={[surfaceMin, surfaceMax]}
                        min={1}
                        max={1000}
                        value={[surfaceMin, surfaceMax]}
                        onChange={handleSurfaceSlider}
                    /> */}
                    {/* <Row align='center'>
                        <Button type='primary' onClick={filterBySurface}>Apply</Button>
                    </Row> */}
                </Form.Item>

                <Divider />

                <Form.Item
                    label="Duration (Days)"
                    name="duration"
                >
                    <Input.Group >
                        <Row>
                            {/* <Space direction='horizontal'> */}
                            <Col span={12}>
                                <Form.Item
                                    name={['duration', 'durationMin']}
                                    noStyle
                                >
                                    <InputNumber placeholder="Min" value={durationMin} onChange={handleDurationMin} />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name={['duration', 'durationMax']}
                                    noStyle
                                >
                                    <InputNumber placeholder="Max" value={durationMax} onChange={handleDurationMax} />
                                </Form.Item>
                            </Col>
                            {/* </Space> */}
                        </Row>
                    </Input.Group>
                    {/* <Slider
                        range={{ draggableTrack: true }}
                        defaultValue={[durationMin, durationMax]}
                        min={durationMin}
                        max={durationMax}
                        value={[durationMin, durationMax]}
                        onChange={handleDurationSlider}
                    /> */}
                    {/* <Row align='center'>
                        <Button type='primary' onClick={filterByDuration}>Apply</Button>
                    </Row> */}
                </Form.Item>

                <Divider />

                <Form.Item
                    label="Type"
                    name="type"
                >
                    <Select style={{ width: '100%' }} onChange={filterByType}>
                        <Option value="ground">Ground</Option>
                        <Option value="building">Building</Option>
                    </Select>
                </Form.Item>

                <Divider />

                <Form.Item
                    label="Availability"
                    name="availability"
                >
                    <Select style={{ width: '100%' }} onChange={filterByAvailability}>
                        <Option value="occupied">Occupied</Option>
                        <Option value="unoccupied">Unoccupied</Option>
                    </Select>
                </Form.Item>

                <Divider />

                <Form.Item>
                    <Row align='center'>
                        <Space
                            direction='horizontal'
                            size='large'
                        >
                            <Button type="primary" htmlType="submit" size='medium' loading={loading}>
                                Apply Filters
                            </Button>

                            <Button type="primary" size="medium" ghost danger onClick={resetMap}>
                                Reset Filters
                            </Button>
                        </Space>
                    </Row>

                </Form.Item>
            </Form>

        </>
    );
}

export default Filter_Form;
