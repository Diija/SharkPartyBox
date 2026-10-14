import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MorajaiBox } from './morajai-box';

describe('MorajaiBox', () => {
  let component: MorajaiBox;
  let fixture: ComponentFixture<MorajaiBox>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MorajaiBox],
    }).compileComponents();

    fixture = TestBed.createComponent(MorajaiBox);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
