import { EventEmitter } from "eventemitter3";
import { HipEmitterTypes } from "./types";

/**
 * 组件本质是一个事件触发器
 */
export interface HipComponent extends EventEmitter<HipEmitterTypes> {
  name: string;
}

/**
 * 内容管理，必须要提供获取一个随机内容和获取全部内容的实现
 */
export interface IContentManager<ContentType extends IContent> {
  getRandom: (filter: (content: ContentType) => boolean) => ContentType;
  getAll: () => ContentType[];
}

export interface IContent {
  name: string;
  desc: string;
}