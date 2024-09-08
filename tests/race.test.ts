
import { Race } from '../src/Race';
import { Horse } from '../src/Horse';
import { HorseStatus } from '../src/types';

test('horse.modify', () => {
    const race = new Race();
    const me = new Horse(race, { id: 'me' });

    console.log(me.Property)

    me.modify({
        speed: +2,
        status: HorseStatus.LEFT
    });
    console.log(me.Property)

    me.modify({
        speed: +2,
        status: HorseStatus.DEAD

    }, true);
    console.log(me.Property)

});
