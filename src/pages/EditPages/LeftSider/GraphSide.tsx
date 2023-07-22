import {isGraphComponent, defaultComponentStyle} from "src/utils/const";
import {addCmp} from "src/store/editStore";
import leftSideStyles from "./leftSide.module.less";

const defaultStyle = {
  ...defaultComponentStyle,
  width: 120,
  height: 120,
  borderColor: "blue",
  backgroundColor: "blue",
};

const settings = [
  {
    key: "graph0",
    style: {
      ...defaultStyle,
      borderWidth: 1,
      borderStyle: "solid",
      backgroundColor: "transparent",
    },
  },
  {
    key: "graph1",
    style: defaultStyle,
  },
  {
    key: "graph2",
    style: {
      ...defaultStyle,
      borderWidth: 1,
      borderStyle: "solid",
      backgroundColor: "transparent",
      borderRadius:'100%'
    },
  },
];

const GraphSider = () => {
  console.log("GraphSider render"); //sy-log
  return (
    <div className={leftSideStyles.main}>
      <ul className={leftSideStyles.box}>
        {settings.map((item) => (
          <li
            draggable={true}
            key={item.key}
            className={leftSideStyles.item}
            onClick={() => addCmp({...item, type: isGraphComponent})}
            onDragStart={(e) => {
              e.dataTransfer.setData(
                "drag-cmp",
                JSON.stringify({...item, type: isGraphComponent})
              );
            }}
            style={{
              width: item.style.width,
              height: item.style.height,
              backgroundColor: item.style.backgroundColor,
              borderStyle: item.style.borderStyle,
              borderColor: item.style.borderColor,
              borderRadius:item.style.borderRadius
            }}></li>
        ))}
      </ul>
    </div>
  );
};

export default GraphSider;

