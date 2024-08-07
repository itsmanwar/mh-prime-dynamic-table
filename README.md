
# mh-prime-dynamic-table : Your Data, Your Rules!

Welcome to ***mh-prime-dynamic-table***, where creating dynamic data tables in your Angular project has never been easier or more enjoyable! Powered by *PrimeNG's versatile p-table component, mh-prime-dynamic-table empowers you to effortlessly craft interactive data tables with features like filtering, sorting, and pagination. Let's dive in and unleash the magic of data visualization!


## Quick Setup ⚙️

First things first, make sure you have the coolest data visualization toolkit - **PrimeNG** - on board anong with **PrimeIcons** and **PrimeFlex**. If not, let's get it installed:

```bash
npm install primeng
npm install primeicons
npm install primeflex
```
With PrimeNG ready to roll, now's the time to install mh-prime-dynamic-table:
```bash
npm install mh-prime-dynamic-table
```

## Getting Started 🚀
Now that we're all set up, let's integrate mh-prime-dynamic-table into your Angular project:
1. **Import the DynamicTableModule:** Head over to your Angular module file and import the `MhPrimeDynamicTableModule`:
```typescript
import { MhPrimeDynamicTableModule } from 'mh-prime-dynamic-table';

@NgModule({
  imports: [
    MhPrimeDynamicTableModule
  ]
})
export class YourModule { }
```
2.**Use the mh-prime-dynamic-table Component:** Drop the `mh-prime-dynamic-table` component into your component template. Flex your creative muscles by passing in your data and configuring your table:
```html
<mh-prime-dynamic-table
  size="small"
  [numberRowsShown]="10"
  [rowsPerPageOptions]="[10, 30, 50]"
  [data]="tableData"
  rowSelectionMode="multiple",
  [isLoading]="isTableDataLoading"
  [actionButtons]="tableActionButton"
  [childActionButtons]="tableChildActionButton"
  (rowSelect)="handleRowSelection($event)"
  (actionButtonClicked)="handleButtonClick($event)"
  (queryParameterChange)="handQueryParameterChange($event)",
  (searchKeyChange)="handsearchKeyChange($event)",
>
</mh-prime-dynamic-table>
```
3. **Handle the Magic:** Handle the output emitted by `mh-prime-dynamic-table` and let your imagination run wild with the endless possibilities:
```typescript
handleTableOutput(output: any) {
  // Let your data dance to the tunes of user interactions
}
```

## Properties & Emitters: Your Playground 🔣
- **Properties:**

| **Name**             	| **Type**                         	| **Default**    	| **Description**                                                                       |
|----------------------	|----------------------------------	|----------------	|-------------------------------------------------------------------------------------- |
| ``data``              | any[]                            	| ``null``       	| An array of objects to display.                                                       |
| ``numberRowsShown``   | number                           	| ``10``         	| Number of rows to display per page.                                                   |
| ``rowsPerPageOptions``| any[]                            	| ``[10,20,30]`` 	| Array of integer/object values to display  inside rows per page dropdown of paginator |
| ``rowSelectionMode``  | "none" \| "single" \| "multiple" 	| ``"none"``     	| Specifies the selection mode, valid values are  "single" and "multiple".              |
| ``selectedRow``       | any[]                             | "none"          | Array of selected rows passed from the parent component.                              |
| ``size``              | "small" \| "normal" \| "large"   	| ``"normal"``   	| Specifies the table size, valid values are "small","normal" and "large".              |
| ``actionButtons``     | ActionButtonConfig[]             	| ``null``       	| Array of object to display action buttons inside rows                                 |
| ``childActionButtons``| ActionButtonConfig[]             	| ``null``       	| Array of object to display action buttons inside child rows                           |
| ``showPaginator``     | boolean             	            | ``false``       | Show or hide the paginator.                                                           |
| ``disableSorting``    | boolean             	            | ``false``       | Disable sorting.                                                                      |
| ``disableFiltering``  | boolean             	            | ``false``       | Disable filtering.                                                                    |
| ``isLoading``         | boolean             	            | ``false``       | Displays a loading placeholder to indicate data load is in progress.                  |
| ``showTopMenubar``    | boolean             	            | ``false``       | Show or hide top menubar.                                                             |
| ``showGlobalSearch``  | boolean             	            | ``false``       | Show or hide global search.                                                           |


- **Emitters:**

| **Name**             	  | **Parameters**            	| **Description**                                	|
|-----------------------	|---------------------------	|------------------------------------------------	|
| ``queryParameterChange``| event : TableFilterEvent  	| Callback to invoke when data is filtered.      	|
| ``actionButtonClicked`` | event : ActionButtonEvent 	| Callback to invoke when action button clicked. 	|
| ``rowSelect``           | event : any               	| Callback to invoke on selection changed.       	|
| ``searchKeyChange``     | event : string              | Callback to invoke on search key changed.       |

## Example Time! 🌟
- **AppModule:**
```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MhPrimeDynamicTableModule } from 'mh-prime-dynamic-table';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MhPrimeDynamicTableModule,
    HttpClientModule 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```
- **Component:**
```typescript
import { Component, OnInit } from '@angular/core';
import { ActionButtonConfig, DynamicTable, DynamicTableQueryParameters } from 'mh-prime-dynamic-table';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Dynamic Table Example';
  tableData: DynamicTable<userDetils> | any;
  tableQueryParameters: DynamicTableQueryParameters | any;
  tableActionButton: ActionButtonConfig[] = [];
  isTableDataLoading!: boolean;
  constructor(private http: HttpClient) { }
  ngOnInit(): void {
    this.tableActionButton = [
      {
        buttonIdentifier: 'view',
        class: 'p-button-rounded p-button-raised',
        icon: 'pi pi-eye',
        lable: 'View',
      },
      {
        buttonIdentifier: 'active',
        class: 'p-button-success p-button-rounded p-button-raised',
        icon: 'pi pi-trash',
        lable: 'Active',
        renderButton: (rowData) => {
          return rowData.status==='deactivated';
        }
      },
      {
        buttonIdentifier: 'deactive',
        class: 'p-button-danger p-button-rounded p-button-raised',
        icon: 'pi pi-trash',
        lable: 'Deactive',
        renderButton: (rowData) => {
          return rowData.status==='active';
        }
      },
    ];
    this.tableQueryParameters = {
      pageSize: 10,
      pageIndex: 0,
    };
    this.getData();
  }
  handleButtonClick(event: any) {
    console.log(event);
  }
  getData() {
    this.isTableDataLoading = true;
    this.http
      .post<DynamicTable<userDetails>>("api-url", this.tableQueryParameters)
      .subscribe((response) => {
          this.tableData = response.result;
          this.isTableDataLoading = false;
      });
  }
}

```
- **Template:**
```typescript
<mh-prime-dynamic-table
  size="small"
  [numberRowsShown]="10"
  [rowsPerPageOptions]="[10, 30, 50]"
  [data]="tableData"
  rowSelectionMode="multiple",
  [isLoading]="isTableDataLoading"
  [actionButtons]="tableActionButton"
  (rowSelect)="handleRowSelection($event)"
  (actionButtonClicked)="handleButtonClick($event)"
  (queryParameterChange)="handQueryParameterChange($event)",
  (searchKeyChange)="handsearchKeyChange($event)",
>
</mh-prime-dynamic-table>
```
- **Interface:**
```typescript
export interface DynamicTable<T> {
    headers: TableHeader[];
    childHeaders: TableHeader[];
    data: T[];
    dataCount: number;
}

export interface TableHeader {
    name: string;
    dataType: string;
    fieldName: string;
    collapsible: boolean | null;
    filterField: string;
    isSortable: boolean;
    isFilterable: boolean;
    filterEnums?: FilterEnum[];
    objectTypeValueField?: number;
}
export interface HeaderGroups {
    headers: TableHeader[];
    collapsibleHeaders: TableHeader[];
}
export interface ExpandedRows {
    [key: string]: boolean;
}
export interface FilterEnum {
    value: Number
    label: string
    styleClass: string
}
export interface FilterParameter {
    field: string;
    value: string;
    operator: string;
}

export interface SortParameter {
    field: string;
    order: string;
}

export interface DynamicTableQueryParameters {
    // listType: string;
    pageSize: number;
    pageIndex: number;
    filterParameters: FilterParameter[];
    sortParameters: SortParameter;
}
export interface ActionButtonConfig<T = any> {
    lable: string,
    icon: string,
    class: string,
    buttonIdentifier: string,
    renderButton?: (data: T) => boolean,
}
export interface ActionButtonEvent {
    rowData: any,
    buttonIdentifier: string
}
```
## Contribute & Share the Joy! 🌈
Feel the urge to sprinkle some extra magic dust? We'd love to have you on board! Contributions are more than welcome. Open issues, submit pull requests, and let's make data visualization an even more delightful experience together!


## License: Spread the Love ❤️
mh-prime-dynamic-table is licensed under the MIT License. Share the love, share the code! For more information, check out the [LICENSE]([https://choosealicense.com/licenses/mit/](https://github.com/itsmanwar/mh-prime-dynamic-table/blob/main/LICENSE)) file.



## Connect with Us! 📡
For more fun-filled adventures with mh-prime-dynamic-table, visit our [GitHub repository](https://github.com/itsmanwar/mh-prime-dynamic-table). Let's build something amazing together!
## Author: The Dreamweavers ✨
Crafted with love by [@manwar](https://github.com/itsmanwar) and a sprinkle of stardust.


## Special Thanks! 🙏
Hats off to the incredible PrimeNG team for their stellar p-table component. You rock!
