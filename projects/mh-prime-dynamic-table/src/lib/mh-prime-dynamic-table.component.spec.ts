import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MhPrimeDynamicTableComponent } from './mh-prime-dynamic-table.component';

describe('MhPrimeDynamicTableComponent', () => {
  let component: MhPrimeDynamicTableComponent;
  let fixture: ComponentFixture<MhPrimeDynamicTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MhPrimeDynamicTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MhPrimeDynamicTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
