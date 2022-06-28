import React, { useState } from 'react';

import { Input, List, Layout, message } from 'antd';

import { searchBySubCity } from '../firebase/firebase_functions';

const { Sider } = Layout;
const { Search } = Input;

const Search_Component = ({ locations, setLocations, mapObject }) => {

    const log = console.log;

    const [loading, setLoading] = useState(false);

    const onSearchChange = (value) => {
        // if (value.nativeEvent.data === null) {
        //   getData({ setLocations });
        // }
    }

    const onSearch = (value) => {
        searchBySubCity({ value, setLoading, setLocations, mapObject, info });
    }

    const info = () => {
        message.info('No advertisements found');
    };

    return (
        <>
            {/* search */}
            <Sider
                width={330}
                style={{
                    overflow: 'auto',
                    height: '40vh',
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
                    onChange={onSearchChange}
                    onSearch={onSearch}
                    loading={loading}
                />

                <List
                    size="medium"
                    dataSource={locations}
                    renderItem={location =>
                        <List.Item
                            className='clickable'
                            onClick={() => {

                                // go to the location
                                mapObject.flyTo({
                                    center: [location.longitude, location.latitude],
                                    zoom: 15,
                                    speed: 3,
                                    curve: 1,
                                    easing: function (t) {
                                        return t;
                                    }
                                });
                            }}
                        >{location.sub_city[0].toUpperCase() + location.sub_city.substring(1) + ' Sub-city' + ' (' + location.latitude + ', ' + location.longitude + ')'}
                        </List.Item>
                    }
                />
            </Sider>

        </>
    );
}

export default Search_Component;
