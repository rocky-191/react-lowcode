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
}

export type AddCmpFC =(_cmp:ICmp)=>void;

export type EditStoreAction = {
  addCmp: AddCmpFC;
};

export interface IEditStore extends EditStoreState, EditStoreAction {}