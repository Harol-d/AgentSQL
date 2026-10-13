import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentQueryUserComponent } from './content-query-user.component';

describe('ContentQueryUserComponent', () => {
  let component: ContentQueryUserComponent;
  let fixture: ComponentFixture<ContentQueryUserComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentQueryUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
