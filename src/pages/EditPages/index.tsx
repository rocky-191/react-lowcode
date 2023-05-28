import { Layout } from "antd";
import styles from "./index.module.less";
import LeftSider from "./LeftSider";
import Center from "./Center";
import RightSider from "./RightSider";

function Index() {
  return (
    <Layout className={styles.main}>
      <div className={styles.content}>
        <LeftSider />
        <Center />
        <RightSider />
      </div>
    </Layout>
  );
}

export default Index;
