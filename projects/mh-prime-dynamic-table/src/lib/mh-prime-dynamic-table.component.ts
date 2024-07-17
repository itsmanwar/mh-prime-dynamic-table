import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TrackByFunction } from '@angular/core';
import { Message } from 'primeng/api';
import { MenuItem } from 'primeng/api';
import * as FileSaver from 'file-saver';
import { TableHeader, ActionButtonConfig, FilterParameter, SortParameter, ActionButtonEvent, DynamicTableQueryParameters, FilterEnum, ExpandedRows, HeaderGroups } from './mh-prime-dynamic-table-interface';
import * as DOMPurify from 'dompurify';

@Component({
    selector: 'mh-prime-dynamic-table',
    templateUrl: './mh-prime-dynamic-table.component.html',
    styleUrls: ['./mh-prime-dynamic-table.component.scss']
})
export class MhPrimeDynamicTableComponent implements OnInit,OnChanges {
    /**
  * small
  * normal 
  * large
  */
    @Input()
    size: string = '';
    @Input()
    data: any;
    @Input()
    showPaginator: boolean = false;
    @Input()
    numberRowsShown: number = 5;
    @Input()
    rowsPerPageOptions: any[] = [10, 20, 30];
    @Input()
    disableSorting: boolean = false;
    @Input()
    disableFiltering: boolean = false;
    @Input()
    actionButtons: ActionButtonConfig[] = [];
    @Input()
    childActionButtons: ActionButtonConfig[] = [];
    /**
     * none
     * single 
     * multiple
     */
    @Input()
    rowSelectionMode: string = 'none';
    @Input()
    selectedRow: any[] = [];
    @Input()
    isLoading: boolean = false;
    @Input()
    showTopMenubar: boolean = false;
    @Input()
    showGlobalSearch: boolean = true;

    @Output()
    rowSelect = new EventEmitter<any>();
    @Output()
    actionButtonClicked = new EventEmitter<any>();
    @Output()
    queryParameterChange = new EventEmitter<any>();
    @Output()
    searchKeyChange: EventEmitter<string> = new EventEmitter<string>();

    headers: TableHeader[] = [];
    dataCount!: number;
    sizes!: any[];
    filterParams: FilterParameter[] = [];
    selectedRows: any;
    sortParams: SortParameter | any;
    sortOrder: number | any;
    pageSize: number = 10;
    pageIndex: number = 0;
    sortField: string | any;
    errors: Message[] = []
    exportExcelSplitButtons!: MenuItem[];
    exportPdfSplitButtons!: MenuItem[];
    exportColumns!: any[];
    tableData: any;
    collapsibleHeadersData: any;
    nonCollapsibleHeaders: any;
    collapsibleHeaders: TableHeader[] = [];
    collapsibleHeaderUniqueId: string = '';
    isExpanded: boolean = false;
    expandedRows: ExpandedRows = {};
    lodingTable: string[] = [];
    numberOfColspan: number = 0;
    // uniqueIdCounter: number = 0;
    columnDataLoading: boolean = false;
    ngOnInit(): void {
        if (this.selectedRow.length > 0) {
            this.selectedRows = this.selectedRow;
        }
        this.sizes = [
            { name: 'small', class: 'p-datatable-sm' },
            { name: 'normal', class: '' },
            { name: 'large', class: 'p-datatable-lg' }
        ];
        this.exportColumns = this.headers.map(col => ({ title: col.name, dataKey: col.fieldName }));
        this.exportExcelSplitButtons = [
            {
                label: 'Export All',
                icon: 'pi pi-copy',
                command: () => { this.exportExcel() }
            },
            {
                label: 'Export Selected',
                icon: 'pi pi-check-square',
                command: () => { this.exportExcelSelected() }
            },
        ];

        this.exportPdfSplitButtons = [
            {
                label: 'Export All',
                icon: 'pi pi-copy',
                command: () => { this.exportPdf() }
            },
            {
                label: 'Export Selected',
                icon: 'pi pi-check-square',
                command: () => { this.exportPdfSelected() }
            },
        ];
        this.lodingTable = Array.from({ length: this.numberRowsShown }, () => "");

    }
    ngOnChanges(changes: SimpleChanges): void {
        if (changes['data'] && changes['data'].previousValue !== changes['data'].currentValue) {
            this.data = changes['data'].currentValue;
            this.headers = this.data.headers;
            if (this.headers.length == 0) {
                this.errors.push({ severity: 'error', summary: 'Header missing!', detail: '' });
                throw new Error('Header missing!');
            }
            this.dataCount = this.data.dataCount;
            if (this.dataCount === null || this.dataCount === undefined) {
                this.errors.push({ severity: 'error', summary: 'Data Count missing!', detail: '' });
                throw new Error('Data Count missing!!');
            }
            const { headers: nonCollapsibleHeaders, collapsibleHeaders } = this.splitHeaders(this.headers);
            this.nonCollapsibleHeaders = nonCollapsibleHeaders;
            this.collapsibleHeaders = collapsibleHeaders;
            if (this.collapsibleHeaders.length > 0 && this.data.childHeaders && this.data.childHeaders.length > 0) {
                this.errors.push({ severity: 'error', summary: 'The Header should not contain both "collapsibleHeaders" and "childHeaders" properties', detail: '' });
                throw new Error('The Header should not contain both "collapsibleHeaders" and "childHeaders" properties');
            }
            if (this.collapsibleHeaders.length > 0) {
                this.tableData = this.extractCollapsibleData(this.data);
            }
            if (this.collapsibleHeaders.length === 0) {
                this.collapsibleHeaders = (this.data.childHeaders && this.data.childHeaders.length > 0) ? this.data.childHeaders : [];
                this.tableData = this.data.data;
            }
            this.exportColumns = this.headers.map(col => ({ title: col.name, dataKey: col.fieldName }));
            this.numberOfColspan = this.nonCollapsibleHeaders.length + this.collapsibleHeaders.length +
                (this.rowSelectionMode === 'single' || this.rowSelectionMode === 'multiple' ? 1 : 0) +
                (this.actionButtons.length > 0 ? 1 : 0);
            this.columnDataLoading = false;
        }
    }
    //[Event]==================================================================
    emitButtonClickEvent(data: any, buttonType: string) {
        const actionButtonEventProperties: ActionButtonEvent = {
            buttonIdentifier: buttonType,
            rowData: data,
        };
        this.actionButtonClicked.emit(actionButtonEventProperties);
    }
    emitRowSelectEvent() {
        if (this.rowSelectionMode === 'single') {
            const parentIdToLastIndex = new Map<number, number>();
            for (let i = this.selectedRows.length - 1; i >= 0; i--) {
                const item = this.selectedRows[i];
                if (!parentIdToLastIndex.has(item.parentId)) {
                    parentIdToLastIndex.set(item.parentId, i);
                }
            }

            for (let i = this.selectedRows.length - 1; i >= 0; i--) {
                const item = this.selectedRows[i];
                const lastIndex = parentIdToLastIndex.get(item.parentId);
                if (i !== lastIndex) {
                    this.selectedRows.splice(i, 1);
                }
            }
        }
        this.rowSelect.emit(this.selectedRows);
    }
    emitQueryParameterChange() {
        const queryParameters: DynamicTableQueryParameters = {
            pageSize: this.pageSize,
            pageIndex: this.pageIndex,
            filterParameters: this.filterParams,
            sortParameters: this.sortParams,
        };
        this.columnDataLoading = true;
        this.queryParameterChange.emit(queryParameters);
    }
    //[Event END]==============================================================

    //[Filter]=================================================================
    onFilter(event: any) {
        const originalObject = event.filters;
        const convertedFilters: FilterParameter[] = [];
        // Store previously processed filters to avoid duplicates
        const processedFilters = new Set<string>();
        for (const key in originalObject) {
            const filterObject = originalObject[key][0];

            // Check if value has changed and filter hasn't been processed
            const filterKey = `${key}-${filterObject.value}`;
            if (
                filterObject.value !== null &&
                !processedFilters.has(filterKey)
            ) {
                processedFilters.add(filterKey);
                convertedFilters.push({
                    field: this.getFilterField(key, this.headers),
                    value: filterObject.value.toString(),
                    operator: filterObject.matchMode,
                });
            }
        }

        // Update filterParams only if there are changes
        if (
            JSON.stringify(this.filterParams) !==
            JSON.stringify(convertedFilters)
        ) {
            this.filterParams = convertedFilters;
            this.emitQueryParameterChange();
            this.columnDataLoading = true;
        }
    }
    //[Filter END]=============================================================

    //[Sorting]================================================================
    onSortChange(event: any) {
        const incomingShortParameter: SortParameter = {
            field: event.field,
            order: event.order === 1 ? 'ASC' : 'DESC',
        };
        if (
            JSON.stringify(this.sortParams) !=
            JSON.stringify(incomingShortParameter)
        ) {
            this.sortParams = incomingShortParameter;
            this.emitQueryParameterChange();
            this.columnDataLoading = true;

        }
    }
    //[Sorting END]============================================================
    //[Pagination]=============================================================
    onPageChange($event: any) {
        if (this.pageSize != $event.rows || this.pageIndex != $event.first) {
            this.pageIndex = $event.first;
            this.pageSize = $event.rows;
            this.emitQueryParameterChange();
            this.columnDataLoading = true;

        }
    }
    //[Pagination END]=========================================================

    //[Export PDF And Excel]===================================================
    exportPdf() {
        import("jspdf").then(jsPDF => {
            import("jspdf-autotable").then(x => {
                const doc = new jsPDF.default('p', 'px', 'a4');
                (doc as any).autoTable(this.exportColumns, this.data);
                doc.save(`${'data_export_' + new Date().getTime()}.pdf`);
            })
        })
    }

    exportPdfSelected() {
        import("jspdf").then(jsPDF => {
            import("jspdf-autotable").then(x => {
                const doc = new jsPDF.default('p', 'px', 'a4');
                (doc as any).autoTable(this.exportColumns, this.selectedRows);
                doc.save(`${'data_export_' + new Date().getTime()}.pdf`);
            })
        })
    }

    saveAsExcelFile(buffer: any, fileName: string): void {
        let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        let EXCEL_EXTENSION = '.xlsx';
        const data: Blob = new Blob([buffer], {
            type: EXCEL_TYPE
        });
        FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    }

    exportExcel() {
        import("xlsx").then(xlsx => {
            const worksheet = xlsx.utils.json_to_sheet(this.data);
            const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
            const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
            this.saveAsExcelFile(excelBuffer, "data");
        });
    }

    exportExcelSelected() {
        import("xlsx").then(xlsx => {
            const worksheet = xlsx.utils.json_to_sheet(this.selectedRows);
            const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
            const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
            this.saveAsExcelFile(excelBuffer, "data");
        });
    }
    //[Global Serach]===================================================
    globalSearch(searchKey: string) {
        this.searchKeyChange.emit(searchKey);
        this.columnDataLoading = true;

    }
    //[Helper functions]=======================================================
    lowercaseFirstLetter(input: string): string {
        const [firstLetter, ...rest] = input;
        return `${firstLetter.toLowerCase()}${rest.join('')}`;
    }
    uppercaseFirstLetter(input: string): string {
        const [firstLetter, ...rest] = input;
        return `${firstLetter.toLocaleUpperCase()}${rest.join('')}`;
    }
    getFilterField(fieldName: string, objects: TableHeader[]): string {
        const foundObject = objects.find(obj => obj.fieldName === fieldName);
        return foundObject ? foundObject.filterField : "";
    }
    getEnumStyle(enumValue: number, objects: FilterEnum[]): string {
        const foundObject = objects.find(obj => obj.value === enumValue);
        return foundObject ? foundObject.styleClass : "";
    }
    getTableSizeClass(size: string) {
        const foundObject = this.sizes.find(obj => obj.name === size);
        return foundObject ? foundObject.class : "";
    }
    trackByFunc: TrackByFunction<ActionButtonConfig> = (index, item) => {
        return index; // Assuming each actionButton has a unique 'id' property
    };
    splitHeaders(headers: TableHeader[]): HeaderGroups {
        const headersList: TableHeader[] = [];
        const collapsibleHeadersList: TableHeader[] = [];

        headers.forEach(header => {
            if (header.collapsible) {
                collapsibleHeadersList.push(header);
            } else {
                headersList.push(header);
            }
        });
        return {
            headers: headersList,
            collapsibleHeaders: collapsibleHeadersList
        };
    }
    private extractCollapsibleData(data: any): any[] {
        if (data.data && this.collapsibleHeaders.length > 0) {
            const filterKeys = new Set(this.collapsibleHeaders.map((h: any) => h.fieldName));
            return data.data.map((d: any) => {
                const expendable: Record<string, any> = {};
                for (const header of this.collapsibleHeaders) {
                    expendable[header.fieldName] = d[header.fieldName];
                }
                const dynamicObject = Object.entries(d).reduce((acc, [key, value], index) => {
                    if (!filterKeys.has(key)) {
                        acc[key] = value;
                    }
                    return acc;
                }, {} as Record<string, any>);
                return {
                    ...dynamicObject,
                    childData: [expendable]
                };
            });
        }
        return data.data;
    }
    expandAll() {
        if (!this.isExpanded) {
            this.tableData.forEach((data: any) => data && data.id ? this.expandedRows[data.id] = true : '');
        } else {
            this.expandedRows = {};
        }
        this.isExpanded = !this.isExpanded;
    }
    sanitizeHtml(html: string): string {
        return DOMPurify.sanitize(html);
    }
    //[Helper functions END]===================================================
}
