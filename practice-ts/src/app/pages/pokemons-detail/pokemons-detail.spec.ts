import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PokemonsDetail } from './pokemons-detail';

describe('PokemonsDetail', () => {
  let component: PokemonsDetail;
  let fixture: ComponentFixture<PokemonsDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokemonsDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(PokemonsDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
