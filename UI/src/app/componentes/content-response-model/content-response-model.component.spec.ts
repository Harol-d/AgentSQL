import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentResponseModelComponent } from './content-response-model.component';

describe('ContentResponseModelComponent', () => {
  let component: ContentResponseModelComponent;
  let fixture: ComponentFixture<ContentResponseModelComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentResponseModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
