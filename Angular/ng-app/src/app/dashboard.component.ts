import { Component , OnInit } from '@angular/core';
import { Hero } from './hero';
import { HeroService } from './hero.service';

@Component({
  selector: 'dashboard',
  templateUrl: `/app/dashboard.html`
})
export class DashboardComponent implements OnInit{ 
	heroes:Hero[]=[];
	selectedHero:Hero;
	constructor(private heroService:HeroService){}
	ngOnInit(): void {
		this.heroService.getHeroes().then(heroes => this.heroes = heroes.slice(1, 5));
	}
	onSelect(hero:Hero):void{
    	this.selectedHero = hero;
  }
}
