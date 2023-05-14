import React from 'react';
import {Layout} from 'antd';
import Login from './Login';
import {Outlet} from 'react-router-dom';

const {Header}=Layout

function RequireAuth() {
  const headerStyle: React.CSSProperties = {
    textAlign: "center",
    color: "#fff",
    height: 64,
    paddingInline: 10,
    lineHeight: "64px",
    backgroundColor: "black",
  };
  return (
    <div>
      <Layout>
        <Header style={headerStyle}>
          <Login></Login>
        </Header>

        <Outlet />
      </Layout>
    </div>
  );
}

export default RequireAuth;