import { Component, OnInit } from '@angular/core';

@Component({
   selector    : 'app-xt-for',
   templateUrl : './xt-for.component.html',
   styleUrls   : ['./xt-for.component.css']
})
export class XtForComponent implements OnInit {

   public items = [{id : 1, value : 'a'}, {id : 2, value : 'b'}, {id : 3, value : 'c'}];

   constructor()
   {
   }

   ngOnInit()
   {
   }
}
