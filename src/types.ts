import { Horse } from "./Horse";
import { Race } from "./Race";
import { EventEmitter } from "eventemitter3";
import { Track } from "./Track";
import { Segment } from "./Segment";

interface RaceLog {
  player: string;
  content: string;
  round: number;
}

/**
 * 一个最简单的表示用户元数据的方式
 */
interface UserInfo {
  name?: string;
  id: string;
  channel?: string;
}

/**
 * 效果的类型
 */
enum EffectType {
  /**
   * 正面效果
   */
  Positive = 0,
  /**
   * 负面效果
   */
  Negative = 1,
  /**
   * 中立效果
   */
  Neutral = 2,
}

/**
 * 马的状态
 */
enum HorseStatus {
  /**
   * 正常
   */
  NORMAL = 0,
  /**
   * 死亡，不会在主循环中计算
   */
  DEAD = 1,
  /**
   * 离场，不会在主循环中计算
   */
  LEFT = 2,
  /**
   * 无法选中，状态下不应该被取随机玩家方法返回
   */
  UNABLE_SELECT = 3,
}

/**
 * 一个Buff的基础信息
 */
type BuffInfo = {
  name: string; //Buff名称
  type: EffectType; //效果类型，
  desc: string; //简单描述
  doc?: string; //由doc提供
  canStack?: boolean; //是否可以叠加
  priority?: number; //应为1-100,优先级越大，越会在后面处理
};

export type HipEmitterTypes = {
  // race events
  "race.start": (race: Race) => void /** 赛事开始 */;

  // round events
  /**
   * 新一轮开始
   * @param round 当前轮数
   */
  "round.start": (race: Race, round: number) => void /** 新一轮开始 */;
  "round.end": (race: Race, round: number) => void /** 新一轮结束 */;

  // horse events
  "horse.round.start": (
    race: Race,
    horse: Horse
  ) => void /** 新一轮的选手回合开始 */;
  "horse.round.end": (
    race: Race,
    horse: Horse
  ) => void /** 新一轮的选手回合结束 */;

  /**
   * @param moved 尝试移动距离
   * @returns 是否允许移动
   */
  "horse.move": (
    race: Race,
    horse: Horse,
    move: number
  ) => boolean /** 选手移动 */;
  /**
   * @param moved 真实移动距离
   */
  "horse.moved": (
    race: Race,
    horse: Horse,
    moved: number
  ) => void /** 选手移动完毕 */;

  // segment events
  "segment.round.start": (
    race: Race,
    segment: Segment
  ) => void /** 新一轮的赛道格子开始 */;
  "segment.round.end": (
    race: Race,
    segment: Segment
  ) => void /** 新一轮的赛道格子结束 */;

  // track events
  "track.round.start": (
    race: Race,
    track: Track
  ) => void /** 新一轮的赛道开始 */;
  "track.round.end": (race: Race, track: Track) => void /** 新一轮的赛道结束 */;

  // buff events
  "buff.end": (ctx: {
    race: Race;
    horse: Horse;
    buff: BuffInfo;
  }) => void /** 效果结束 */;
  "buff.effect": (ctx: {
    race: Race;
    horse: Horse;
    buff: BuffInfo;
  }) => void /** 效果作用于目标时 */;

  [key: string]: (...args: any[]) => void;
};

// 定义一个泛型类型Buff，它继承自BuffInfo，并且包含以下属性：
type Buff<T> = BuffInfo & {
  // listeners属性是一个对象，它的键是HipEmitterTypes的键，值是HipEmitterTypes的值
  listeners?: { [K in keyof HipEmitterTypes]?: HipEmitterTypes[K] };
  // listener属性是一个EventEmitter，它的类型是HipEmitterTypes
  listener?: EventEmitter<HipEmitterTypes>;
  // modifier属性是一个函数，它的参数是target和buff，返回值是T
  modifier?: (target: T, buff: BuffWithTime<T>) => T;
};

// 定义一个类型BuffWithTime，它是一个联合类型，包含Buff类型和times、remains、stacks属性
type BuffWithTime<T> = Buff<T> & {
  // times属性，表示Buff的次数
  times: number;
  // remains属性，表示Buff的剩余次数
  remains: number;
  // stacks属性，表示Buff的堆叠次数
  stacks: number;
};

export type { UserInfo, Buff, BuffWithTime, RaceLog };
export { EffectType, HorseStatus };
