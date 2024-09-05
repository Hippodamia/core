
import { debug, log } from 'console';
import { Race } from '../src/Race';
import { Horse } from '../src/Horse';

test('hello world test', () => {

    const race = new Race();
    race.join({ id: '1223' }, 'hello world');
    race.join({ id: '33433' }, '--!');
    race.join({ id: '4444' }, '!!!');
    race.start();

    race.next();
    race.next();
    race.next();

    race.next();
    race.next();

    log(race.toString());
});


test('step random test', () => {

    let arr: number[] = []
    for (let index = 0; index < 100; index++) {
        const race = new Race();
        const steps = new Horse(race,{ id: '1223' },'😂').getRandomSteps();
        arr.push(steps)
        arr.push(steps)
    }

    log(`0:${arr.filter(x => x == 0).length}`);
    log(`1:${arr.filter(x => x == 1).length}`);
    log(`2:${arr.filter(x => x == 2).length}`);
    log(`3:${arr.filter(x => x == 3).length}`);

})