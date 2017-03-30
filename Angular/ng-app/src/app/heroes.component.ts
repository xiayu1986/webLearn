import { Component ,OnInit } from '@angular/core';
import { Hero } from './hero';
import { HeroService } from './hero.service';

@Component({
  selector: 'hero-app',
  templateUrl: `/app/heroes.html`,
  providers:[]
})
export class HeroesComponent implements OnInit { 
  selectedHero:Hero;
  heroes:Hero[];
  constructor(private heroService:HeroService){};
  getHeroes(): void {
    this.heroService.getHeroes().then(heroes => this.heroes = heroes);
  }
  ngOnInit(): void {
    this.getHeroes();
  }
  onSelect(hero:Hero):void{
    this.selectedHero = hero;
  }
 }
