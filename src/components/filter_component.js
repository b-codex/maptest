import React from 'react';

import { Layout, Card } from 'antd';

import Filter_Form from './sub-components/filter_form';

const Filter_Component = ({ setLocations }) => {

    const { Sider } = Layout;

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
                // extra={
                //     <Button type="primary" size="medium" ghost danger onClick={resetMap}>
                //         Reset
                //     </Button>
                // }
                >

                    <Filter_Form setLocations={setLocations} />

                </Card>

            </Sider>
        </>
    );
}

export default Filter_Component;
