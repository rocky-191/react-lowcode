import {create} from "zustand";
import {immer} from "zustand/middleware/immer";
import {
  EditStoreState,
  EditStoreAction,
  ICanvas,
  ICmp,
  Style,
  IEditStore,
  ICmpWithKey
} from "./editStoreTypes";
import {getOnlyKey} from "src/utils";
import Axios from "src/request/axios";
import {getCanvasByIdEnd, saveCanvasEnd} from "src/request/end";
import {resetZoom} from "./zoomStore";
import {recordCanvasChangeHistory} from "./historySlice";
import {cloneDeep} from "lodash";

const useEditStore = create(
  immer<EditStoreState & EditStoreAction>(() => ({
    canvas: getDefaultCanvas(),
    // 记录选中组件的下标
    assembly: new Set(),
    // 历史
    canvasChangeHistory: [{canvas: getDefaultCanvas(), assembly: new Set()}],
    canvasChangeHistoryIndex: 0,
  }))
);

export const clearCanvas = () => {
  useEditStore.setState((draft) => {
    draft.canvas = getDefaultCanvas();
    draft.assembly.clear();
  });
  resetZoom()
};

export const addCmp = (_cmp: ICmp) => {
  useEditStore.setState((draft) => {
    draft.canvas.cmps.push({..._cmp, key: getOnlyKey()});
    draft.assembly = new Set([draft.canvas.cmps.length - 1]);
    recordCanvasChangeHistory(draft)
  });
};

// ! 右键菜单
// 复制选中的单个或者多个组件
export const addAssemblyCmps = () => {
  useEditStore.setState((draft) => {
    const newCmps: Array<ICmpWithKey> = [];
    const cmps = draft.canvas.cmps;
    const newAssembly: Set<number> = new Set();
    let i = cmps.length;

    draft.assembly.forEach((index) => {
      const cmp = cmps[index];
      const newCmp = cloneDeep(cmp);
      newCmp.key = getOnlyKey();

      newCmp.style.top += 40;
      newCmp.style.left += 40;

      newCmps.push(newCmp);
      newAssembly.add(i++);
    });

    draft.canvas.cmps = draft.canvas.cmps.concat(newCmps);
    draft.assembly = newAssembly;
  });
};

// todo 删除选中的组件
export const delSelectedCmps = () => {
  useEditStore.setState((draft) => {
    const assembly = draft.assembly;
    draft.canvas.cmps = draft.canvas.cmps.filter(
      (_, index) => !assembly.has(index)
    );
    draft.assembly.clear();
    recordCanvasChangeHistory(draft);
  });
};

export const saveCanvas = async (
  id: number | null,
  type: string,
  successCallback: (id: number) => void
) => {
  const canvas = useEditStore.getState().canvas;
  const res: any = await Axios.post(saveCanvasEnd, {
    id,
    title: canvas.title,
    content: JSON.stringify(canvas),
    type,
  });

  successCallback(res?.id);
};

export const fetchCanvas = async (id: number) => {
  const res: any = await Axios.get(getCanvasByIdEnd + id);

  if (res) {
    useEditStore.setState((draft) => {
      draft.canvas = JSON.parse(res.content);
      draft.canvas.title = res.title;
      draft.assembly.clear();
      // 初始化历史数据
      draft.canvasChangeHistory = [
        {canvas: draft.canvas, assembly: draft.assembly},
      ];
      draft.canvasChangeHistoryIndex = 0;
    });

    resetZoom()
  }
};

// ! 选中组件
// 全部选中
export const setAllCmpsSelected = () => {
  useEditStore.setState((draft) => {
    const len = draft.canvas.cmps.length;
    draft.assembly = new Set(Array.from({length: len}, (a, b) => b));
  });
};

// 选中多个
// 如果再次点击已经选中的组件，则取消选中
export const setCmpsSelected = (indexes: Array<number>) => {
  useEditStore.setState((draft) => {
    if (indexes)
      indexes.forEach((index) => {
        if (draft.assembly.has(index)) {
          // 取消这个组件的选中
          draft.assembly.delete(index);
        } else {
          // 选中
          draft.assembly.add(index);
        }
      });
  });
};

// 选中单个
// 如果index为-1，则取消选中
export const setCmpSelected = (index: number) => {
  if (index === -1) {
    useEditStore.setState((draft) => {
      if (draft.assembly.size > 0) {
        draft.assembly.clear();
      }
    });
  } else if (index > -1) {
    useEditStore.setState((draft) => {
      draft.assembly = new Set([index]);
    });
  }
};

// ! 修改组件属性
// 根据改变的量来修改
export const updateAssemblyCmpsByDistance = (newStyle: Style) => {
  useEditStore.setState((draft) => {
    draft.assembly.forEach((index) => {
      const cmp = {...draft.canvas.cmps[index]};

      let invalid = false;
      for (const key in newStyle) {
        if (
          (key === "width" || key === "height") &&
          cmp.style[key] + newStyle[key] < 2
        ) {
          invalid = true;
          break;
        }
        cmp.style[key] += newStyle[key];
      }

      if (!invalid) {
        draft.canvas.cmps[index] = cmp;
      }
    });
  });
};

export const recordCanvasChangeHistory_2 = () => {
  // 记录历史的时候，如果前后两次没有发生变化，则不记录。
  const store = useEditStore.getState();
  if (
    store.canvas ===
    store.canvasChangeHistory[store.canvasChangeHistoryIndex].canvas
  ) {
    return;
  }
  useEditStore.setState((draft) => {
    recordCanvasChangeHistory(draft);
  });
};

// 修改画布 title
export const updateCanvasTitle = (title: string) => {
  useEditStore.setState((draft) => {
    draft.canvas.title = title;
    recordCanvasChangeHistory(draft)
  });
};

// ! 更新画布属性
export const updateCanvasStyle = (_style: any) => {
  useEditStore.setState((draft) => {
    Object.assign(draft.canvas.style, _style);
    recordCanvasChangeHistory(draft)
  });
};

// 修改单个组件的style
export const updateSelectedCmpStyle = (newStyle: Style) => {
  useEditStore.setState((draft) => {
    Object.assign(
      draft.canvas.cmps[selectedCmpIndexSelector(draft)].style,
      newStyle
    );
    recordCanvasChangeHistory(draft);
  });
};

// 修改单个组件的属性
export const updateSelectedCmpAttr = (name: string, value: string) => {
  useEditStore.setState((draft: any) => {
    const selectedIndex = selectedCmpIndexSelector(draft);
    draft.canvas.cmps[selectedIndex][name] = value;
    recordCanvasChangeHistory(draft);
  });
};

// 修改选中组件的style
export const editAssemblyStyle = (_style: Style) => {
  useEditStore.setState((draft) => {
    draft.assembly.forEach((index: number) => {
      const _s = {...draft.canvas.cmps[index].style};
      const canvasStyle = draft.canvas.style;
      if (_style.right === 0) {
        // 计算left
        _s.left = canvasStyle.width - _s.width;
      } else if (_style.bottom === 0) {
        // top
        _s.top = canvasStyle.height - _s.height;
      } else if (_style.left === "center") {
        _s.left = (canvasStyle.width - _s.width) / 2;
      } else if (_style.top === "center") {
        _s.top = (canvasStyle.height - _s.height) / 2;
      } else {
        Object.assign(_s, _style);
      }

      draft.canvas.cmps[index].style = _s;
      recordCanvasChangeHistory(draft);
    });
  });
};

// ! 单个组件修改层级
export const topZIndex = () => {
  useEditStore.setState((draft) => {
    const cmps = draft.canvas.cmps;
    const selectedIndex = selectedCmpIndexSelector(draft);
    if (selectedIndex === cmps.length - 1) {
      return;
    }
    draft.canvas.cmps = cmps
      .slice(0, selectedIndex)
      .concat(cmps.slice(selectedIndex + 1))
      .concat(cmps[selectedIndex]);

    draft.assembly = new Set([cmps.length - 1]);

    recordCanvasChangeHistory(draft);
  });
};

// 置底，把组件放到数组最后
// 0 1 2 3 4
export const bottomZIndex = () => {
  useEditStore.setState((draft) => {
    const cmps = draft.canvas.cmps;
    const selectedIndex = selectedCmpIndexSelector(draft);
    if (selectedIndex === 0) {
      return;
    }
    draft.canvas.cmps = [cmps[selectedIndex]]
      .concat(cmps.slice(0, selectedIndex))
      .concat(cmps.slice(selectedIndex + 1));

    draft.assembly = new Set([0]);

    recordCanvasChangeHistory(draft);
  });
};

// 上移一个层级，和后一个元素交换
// 0 1 3 2 4
export const addZIndex = () => {
  useEditStore.setState((draft) => {
    const cmps = draft.canvas.cmps;
    const selectedIndex = selectedCmpIndexSelector(draft);
    if (selectedIndex === cmps.length - 1) {
      return;
    }
    [draft.canvas.cmps[selectedIndex], draft.canvas.cmps[selectedIndex + 1]] = [
      draft.canvas.cmps[selectedIndex + 1],
      draft.canvas.cmps[selectedIndex],
    ];

    draft.assembly = new Set([selectedIndex + 1]);

    recordCanvasChangeHistory(draft);
  });
};

// 下移一个层级，和前一个元素交换
export const subZIndex = () => {
  useEditStore.setState((draft) => {
    const cmps = draft.canvas.cmps;
    const selectedIndex = selectedCmpIndexSelector(draft);
    if (selectedIndex === 0) {
      return;
    }
    [draft.canvas.cmps[selectedIndex], draft.canvas.cmps[selectedIndex - 1]] = [
      draft.canvas.cmps[selectedIndex - 1],
      draft.canvas.cmps[selectedIndex],
    ];

    draft.assembly = new Set([selectedIndex - 1]);

    recordCanvasChangeHistory(draft);
  });
};

export default useEditStore;

// 选中的单个组件的index
export const selectedCmpIndexSelector = (store: IEditStore): number => {
  const selectedCmpIndex = Array.from(store.assembly)[0];
  return selectedCmpIndex === undefined ? -1 : selectedCmpIndex;
};

function getDefaultCanvas(): ICanvas {
  return {
    title: "未命名",
    // 页面样式
    style: {
      width: 320,
      height: 568,
      backgroundColor: "#ffffff",
      backgroundImage: "",
      backgroundPosition: "center",
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
    },
    // 组件
    cmps: [],
  };
}
