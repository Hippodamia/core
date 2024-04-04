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

interface UserInfo {
  name?: string;
  id: string;
}

enum EffectType {
  Positive,
  Negative,
  Neutral,
}

enum HorseStatus {
  NORMAL = "normal",
  DEAD = "dead",
  LEFT = "left",
}

interface BuffBase {
  name: string;
  type: EffectType; //效果类型，
  desc: string; //简单描述
  doc?: string; //由doc提供
  canStack?: boolean;
  priority?: number; //应为1-100,优先级越大，越会在后面处理
}

export type HipEmitterTypes = {
  "race.start": () => void;
  "round.start": (race: Race) => void;
  "round.end": (race: Race) => void;
  "horse.round.start": (race: Race, horse: Horse) => void;
  "horse.round.end": (race: Race, horse: Horse) => void;
  "horse.moved": (race: Race, moved: number) => void;
  "segment.round.start": (race: Race, segment: Segment) => void;
  "segment.round.end": (race: Race, segment: Segment) => void;
  "track.round.start": (race: Race, track: Track) => void;
  "track.round.end": (race: Race, track: Track) => void;
  /**
   * 效果结束
   * @param ctx
   * @returns
   */
  "buff.end": (ctx: { race: Race; horse: Horse; buff: BuffBase }) => void;
  [key: string]: (...args: any[]) => void;
};

type Buff<T> = BuffBase & {
  listeners?: { [K in keyof HipEmitterTypes]?: HipEmitterTypes[K] };
  listener?: EventEmitter<HipEmitterTypes>;
  modifier?: (target: T, buff: BuffWithTime<T>) => T;
};

type BuffWithTime<T> = Buff<T> & {
  times: number;
  remains: number;
  stacks: number;
};

enum RaceEvent {
  RaceStart,
  RoundStart,
  Track,
  Segment,
  TrackEnd,
  RoundEnd,
  Move,
}

enum RaceMode {
  Pure = "pure",
  RandomEvent = "random",
  Contract = "contract",
}

export type { UserInfo, Buff, BuffWithTime, RaceLog };
export { EffectType, HorseStatus, RaceEvent, RaceMode };
