import { Component,Input,OnInit} from '@angular/core';
import { ActivatedRoute,Params} from '@angular/router';
import { Location} from '@angular/common';

import { Hero } from './hero';
import { HeroService } from './hero.service';

@Component({
  selector: 'hero-detail',
  templateUrl:`/app/hero-detail.html`
})
export class HeroDetailComponent  { 
	constructor(
	private heroService:HeroService,
	private route:ActivatedRoute
	){}
}
