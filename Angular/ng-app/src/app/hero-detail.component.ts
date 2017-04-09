import 'rxjs/add/operator/switchMap';
import { Component,Input,OnInit} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location }               from '@angular/common';

import { Hero } from './hero';
import { HeroService } from './hero.service';


@Component({
	moduleId: module.id,
	selector: 'hero-detail',
	templateUrl:`/app/hero-detail.html`
})
export class HeroDetailComponent  implements OnInit { 
	hero: Hero;
	constructor(
		private heroService: HeroService,
	    private route: ActivatedRoute,
	    private location: Location
	){}
	ngOnInit(): void {
	  	this.route.params.switchMap((params: Params) => this.heroService.getHero(+params['id']))
	  	.subscribe(hero => this.hero = hero);
	}
	goBack(): void {
  		this.location.back();
	}
}
