import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlbumItemGridComponent } from './album-item-grid.component';

describe('AlbumItemGridComponent', () => {
  let component: AlbumItemGridComponent;
  let fixture: ComponentFixture<AlbumItemGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlbumItemGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlbumItemGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
