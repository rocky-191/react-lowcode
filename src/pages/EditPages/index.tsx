import { Layout } from "antd";
import styles from "./index.module.less";
import LeftSider from "./LeftSider";
import Center from "./Center";
import RightSider from "./RightSider";
import Header from "./Header";

function Index() {
  return (
    <Layout className={styles.main}>
      <Header />
      <div className={styles.content}>
        <LeftSider />
        <Center />
        <RightSider />
      </div>
    </Layout>
  );
}

export default Index;
