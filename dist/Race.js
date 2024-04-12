"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Race = void 0;
const Track_1 = require("./Track");
const Horse_1 = require("./Horse");
const utils_1 = require("./utils");
class Race {
    constructor(config = { speed: 10, length: 20, mode: "pure" }) {
        this.tracks = [];
        this.round = 0;
        this.components = [];
        this.logs = [];
        this.players = [];
        this.ended = false;
        this.mode = "pure";
        this.isStarted = false;
        this.config = config;
        this.mode = config.mode;
    }
    onRaceStart() { }
    onRaceRoundStart() {
        this.components.forEach((x) => x.emit("round.end", this, this.round + 1));
    }
    onRaceRoundEnd() {
        this.components.forEach((x) => x.emit("round.end", this, this.round));
    }
    /**
     * Joins a user to the game.
     *
     * @param user - The user information.
     * @param display - The display name for the user.
     * @return Returns true if the user is successfully joined, false otherwise.
     */
    join(user, display) {
        //将用户信息构造为player信息，并在start后进行初始化
        if (this.players.find((x) => x.id == user.id)) {
            return false;
        }
        this.players.push(Object.assign(Object.assign({}, user), { display }));
        return true;
    }
    start() {
        this.isStarted = true;
        //打乱players数组，并为每一个player构建track
        for (const player of (0, utils_1.shuffle)(this.players)) {
            let track;
            this.tracks.push((track = new Track_1.Track()));
            let horse = new Horse_1.Horse(this, player, player.display);
            horse.track = track;
            track.horses = [horse];
            // TODO 允许赛场自定义基础速度与其他基础属性
        }
    }
    next() {
        this.logs = [];
        //赛场回合逻辑
        this.onRaceRoundStart();
        for (let track of this.tracks) {
            track.next(this);
        }
        this.onRaceRoundEnd();
        this.round++;
        //检查超出
        this.tracks.forEach((track) => track.horses.forEach((horse) => {
            if (horse.step > track.segments.length)
                horse.step = track.segments.length;
        }));
        //检查winner
        if (this.tracks.findIndex((track) => track.horses.findIndex((horse) => horse.step >= track.segments.length) >= 0) >= 0) {
            //win
            this.ended = true;
            console.log("WINNER WINNER CHICKEN DINNER!");
        }
    }
    getHorses() {
        let horses = [];
        this.tracks.forEach((t) => {
            horses.push(...t.horses);
        });
        return horses;
    }
    getOthers(excludes) {
        return this.tracks
            .flatMap((t) => t.horses)
            .filter((x) => !excludes.includes(x));
    }
    pushLog(horse, content) {
        this.logs.push({
            player: horse.display,
            content: content.replace("%player%", horse.raw_display),
            round: this.round,
        });
    }
    getRaceResult() {
        const horses = this.getHorses().map((x) => {
            var _a, _b;
            return {
                won: x.step >= ((_b = (_a = x.track) === null || _a === void 0 ? void 0 : _a.segments.length) !== null && _b !== void 0 ? _b : 0),
                step: x.step,
                user: x.user,
                display: x.raw_display,
            };
        });
        return {
            winners: horses.filter((x) => x.won),
            ranks: horses.sort((a, b) => b.step - a.step),
        };
    }
    toString() {
        return JSON.stringify(this.simplify(), undefined, 2);
    }
    simplify() {
        return {
            horses: this.getHorses().map((x) => x.simplify()),
            players: this.players,
            round: this.round,
            ended: this.ended,
            logs: this.logs,
            mode: this.mode,
            config: this.config,
            isStarted: this.isStarted,
            components: this.components.map((c) => c.name),
        };
    }
}
exports.Race = Race;
//# sourceMappingURL=Race.js.map