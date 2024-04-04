
import {Race} from '../src/Race';

test('hello world test', () => {

    const race = new Race();
    race.join({id:'1223'}, 'hello world');
    expect(
        race.players.length
    ).toBe(1);
});