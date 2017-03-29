import { Component } from '@angular/core';
import { Hero } from './hero';
import { HeroService } from './hero.service';

@Component({
  selector: 'my-app',
  templateUrl: `/app/template.html`,
  providers:[HeroService]
})
export class AppComponent  { 
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
