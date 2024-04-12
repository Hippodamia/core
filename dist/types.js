"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RaceMode = exports.RaceEvent = exports.HorseStatus = exports.EffectType = void 0;
var EffectType;
(function (EffectType) {
    EffectType[EffectType["Positive"] = 0] = "Positive";
    EffectType[EffectType["Negative"] = 1] = "Negative";
    EffectType[EffectType["Neutral"] = 2] = "Neutral";
})(EffectType || (exports.EffectType = EffectType = {}));
var HorseStatus;
(function (HorseStatus) {
    HorseStatus["NORMAL"] = "normal";
    HorseStatus["DEAD"] = "dead";
    HorseStatus["LEFT"] = "left";
})(HorseStatus || (exports.HorseStatus = HorseStatus = {}));
var RaceEvent;
(function (RaceEvent) {
    RaceEvent[RaceEvent["RaceStart"] = 0] = "RaceStart";
    RaceEvent[RaceEvent["RoundStart"] = 1] = "RoundStart";
    RaceEvent[RaceEvent["Track"] = 2] = "Track";
    RaceEvent[RaceEvent["Segment"] = 3] = "Segment";
    RaceEvent[RaceEvent["TrackEnd"] = 4] = "TrackEnd";
    RaceEvent[RaceEvent["RoundEnd"] = 5] = "RoundEnd";
    RaceEvent[RaceEvent["Move"] = 6] = "Move";
})(RaceEvent || (exports.RaceEvent = RaceEvent = {}));
var RaceMode;
(function (RaceMode) {
    RaceMode["Pure"] = "pure";
    RaceMode["RandomEvent"] = "random";
    RaceMode["Contract"] = "contract";
})(RaceMode || (exports.RaceMode = RaceMode = {}));
//# sourceMappingURL=types.js.map