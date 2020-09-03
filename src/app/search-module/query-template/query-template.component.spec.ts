import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryTemplateComponent } from './query-template.component';

describe('QueryTemplateComponent', () => {
  let component: QueryTemplateComponent;
  let fixture: ComponentFixture<QueryTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QueryTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QueryTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
