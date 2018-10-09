import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgExtrasComponent } from './ng-extras.component';

describe('NgExtrasComponent', () => {
   let component : NgExtrasComponent;
   let fixture : ComponentFixture<NgExtrasComponent>;

   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations : [NgExtrasComponent]
      })
      .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(NgExtrasComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should create', () => {
      expect(component).toBeTruthy();
   });
});
