import { Injectable} from '@angular/core';
import { Hero } from './hero';
import { HEROES } from'./mock-hero';

@Injectable()
export class HeroService {
	getHeros():Promise<Hero[]>{
		return Promise.resolve(HEROES);
	}
}