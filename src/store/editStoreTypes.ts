import React from 'react'

export type Style=React.CSSProperties;

export interface ICmp {
  type: number;
  style: Style;
  value: string;
  onClick?: string;
}

export interface ICmpWithKey extends ICmp {
  key: number;
}

export interface ICanvas {
  id: null | number;
  title: string;
  type: "content" | "template"; // 页面还是模板页
  content: IContent;
}

export interface IContent {
  style: Style;
  cmps: Array<ICmpWithKey>;
}

export type EditStoreState = {
  canvas:ICanvas;
  assembly:Set<number>;
  // 记录历史
  canvasChangeHistory: Array<{canvas: ICanvas; assembly: Set<number>}>;
  canvasChangeHistoryIndex: number;
}

export type AddCmpFC =(_cmp:ICmp)=>void;

export type EditStoreAction = {
  addCmp: AddCmpFC;
};

export interface IEditStore extends EditStoreState, EditStoreAction {}