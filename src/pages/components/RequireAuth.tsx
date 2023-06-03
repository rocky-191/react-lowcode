import React from "react";
import { Layout, Spin } from "antd";
import Login from "./Login";
import { Outlet } from "react-router-dom";
import useGlobalStore from "src/store/globalStore";

const { Header } = Layout;

function RequireAuth() {
  const loading = useGlobalStore(state => state.loading);
  const headerStyle: React.CSSProperties = {
    textAlign: "center",
    color: "#fff",
    height: 64,
    paddingInline: 10,
    lineHeight: "64px",
    backgroundColor: "black"
  };
  return (
    <div>
      <Layout>
        {loading && (
          <div>
            <Spin size="large" />
          </div>
        )}
        <Header style={headerStyle}>
          <Login></Login>
        </Header>

        <Outlet />
      </Layout>
    </div>
  );
}

export default RequireAuth;
