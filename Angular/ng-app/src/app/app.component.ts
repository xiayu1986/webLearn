import { Component} from '@angular/core';
import { Hero } from './hero';
import { HeroService } from './hero.service';

@Component({
  selector: 'my-app',
  template: `
		<nav class="navbar navbar-inverse">
			<div class="container-fluid">
				<ul class="nav navbar-nav">
		            <li class="active"><a routerLink="/dashboard">Dashboard</a></li>
		            <li><a routerLink="/heroes">Heroes</a></li>
	          	</ul>	
			</div>
		</nav>
		<div class="container-fluid">
			<div class="panel panel-primary">
				<div class="panel-heading">
					<hero-detail [hero]="selectedHero"></hero-detail>
				</div>
				<div class="panel-body">
					<router-outlet></router-outlet>
				</div>
			</div>
		</div>
		
  `
})
export class AppComponent{ 
	selectedHero:Hero;
	heroes:Hero[];
	constructor(private heroService:HeroService){};
	getHeroes(): void {
		this.heroService.getHeroes().then(heroes => this.heroes = heroes);
	}
	onSelect(hero:Hero):void{
		this.selectedHero = hero;
	}
}
