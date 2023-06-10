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
  title:string;
  style:Style;
  cmps:ICmpWithKey[];
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