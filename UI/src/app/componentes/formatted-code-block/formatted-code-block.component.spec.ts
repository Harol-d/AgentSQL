import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormattedCodeBlockComponent } from './formatted-code-block.component';

describe('FormattedCodeBlockComponent', () => {
  let component: FormattedCodeBlockComponent;
  let fixture: ComponentFixture<FormattedCodeBlockComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FormattedCodeBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
