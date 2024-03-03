import { NgModule } from '@angular/core';
import { MhPrimeDynamicTableComponent } from './mh-prime-dynamic-table.component';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { MessagesModule } from 'primeng/messages';
import {DividerModule} from 'primeng/divider';

@NgModule({
  declarations: [
    MhPrimeDynamicTableComponent
  ],
  imports: [
    CommonModule,
    ButtonModule,
    TableModule,
    CheckboxModule,
    DropdownModule,
    DividerModule,
    MessagesModule
  ],
  exports: [
    MhPrimeDynamicTableComponent
  ]
})
export class MhPrimeDynamicTableModule { }
