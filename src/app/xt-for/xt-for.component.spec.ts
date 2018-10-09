import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { XtForComponent } from './xt-for.component';

describe('XtForComponent', () => {
  let component: XtForComponent;
  let fixture: ComponentFixture<XtForComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ XtForComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(XtForComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
