"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Horse = void 0;
const BuffContainer_1 = require("./BuffContainer");
const types_1 = require("./types");
class Horse {
    constructor(race, user, display) {
        this.race = race;
        this.user = user;
        this.step = 1;
        this.buffContainer = new BuffContainer_1.BuffContainer();
        this.raw_display = display;
        this.last_moved = 0;
        this._property = {
            speed: 10,
            effect_resistance: 0,
            luck: 1,
            status: types_1.HorseStatus.NORMAL,
            display: display,
        };
    }
    get Property() {
        let property = this._property;
        return this.buffContainer.getModified(property);
    }
    set Property(value) {
        this._property = value;
    }
    //todo 让property能够被直接更改子值
    onHorseRoundStart(track) {
        this.buffContainer.emit("horse.round.start", this.race, this);
        this.race.components.forEach((x) => x.emit("horse.round.start", this.race, this));
    }
    onHorseRoundEnd(track) {
        this.buffContainer.emit("horse.round.end", this.race, this);
        this.race.components.forEach((x) => x.emit("horse.round.end", this.race, this));
        //刷新冷却回合
        this.buffContainer.refresh(this.race, this);
    }
    /**
     * Executes a move for the horse character, taking into account any active buffs.
     * @return 距离上一次移动的步数
     */
    next(race, track) {
        let step = this.step;
        this.onHorseRoundStart(track);
        this.move(this.getRandomSteps());
        this.onHorseRoundEnd(track);
        this.last_moved = this.step - step;
        return this.last_moved;
    }
    /**
     * 所有的移动必须使用move来进行移动，移动有一个「无视异常状态」的选项
     * @param step 移动的步数
     * @param ignoreStatus 是否无视异常状态
     */
    move(step, ignoreStatus = false) {
        let move = step;
        if (this.Property.status == types_1.HorseStatus.NORMAL) {
            //计算buff是否导致无法移动
            let canMove = true || ignoreStatus;
            //canMove = this.buffContainer.emit
            //canMove = this.buffs.call<boolean, any>("canMove", true, this, {race, horse: this, track});
            if (canMove) {
                this.step += move;
                this.buffContainer.emit("horse.moved", this.race, this, move);
                this.race.components.forEach((x) => x.emit("horse.moved", this.race, this, move));
            }
        }
    }
    get display() {
        return this.Property.display;
    }
    getRandomSteps() {
        function sigmoid(x, k, a) {
            return 1 / (1 + Math.exp(-k * (x - a)));
        }
        const k = 0.2; // 调整函数的陡峭程度
        const a = 10; // 控制函数的中心位置
        const p = sigmoid(Math.min(this.Property.speed, 20), k, a);
        const randomNumber = Math.random();
        if (p < 0.2) {
            return 0;
        }
        else if (p > 0.8) {
            return 3;
        }
        else {
            return randomNumber < 0.5 ? 1 : 2;
        }
    }
    toString() {
        return JSON.stringify(this.simplify());
    }
    simplify() {
        return {
            property: this.Property,
            step: this.step,
            last_moved: this.last_moved,
            buffs: this.buffContainer._buffs,
            user: this.user,
            raw_display: this.raw_display,
        };
    }
}
exports.Horse = Horse;
//# sourceMappingURL=Horse.js.map