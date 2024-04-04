import { EventEmitter } from "eventemitter3";
import { HipEmitterTypes } from "./types";

/**
 * 组件本质是一个事件触发器
 */
export class HipComponent extends EventEmitter<HipEmitterTypes> { }

/**
 * 玩法大部分是内容提供
 */
export interface IContentManager<ContentType extends IContent> {
  getRandom: (filter: (content: ContentType) => boolean) => ContentType;
  getAll: () => ContentType[];
}

export interface IContent {
  name: string;
  desc: string;
}
