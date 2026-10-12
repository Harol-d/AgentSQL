import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardPoke } from './card-poke';

describe('CardPoke', () => {
  let component: CardPoke;
  let fixture: ComponentFixture<CardPoke>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardPoke],
    }).compileComponents();

    fixture = TestBed.createComponent(CardPoke);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
