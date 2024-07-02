import { NgModule } from '@angular/core';
import { MhPrimeDynamicTableComponent } from './mh-prime-dynamic-table.component';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { MessagesModule } from 'primeng/messages';
import {DividerModule} from 'primeng/divider';
import {DataViewModule} from 'primeng/dataview';
import {ToolbarModule} from 'primeng/toolbar';
import { SplitButtonModule } from 'primeng/splitbutton';
import {TooltipModule} from 'primeng/tooltip';
import {FormsModule} from '@angular/forms';
import {InputTextModule} from 'primeng/inputtext';
import {PaginatorModule} from 'primeng/paginator';

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
    MessagesModule,
    DividerModule,
    DataViewModule,
    ToolbarModule,
    SplitButtonModule,
    TooltipModule,
    FormsModule,
    InputTextModule,
    PaginatorModule
  ],
  exports: [
    MhPrimeDynamicTableComponent
  ]
})
export class MhPrimeDynamicTableModule { }
