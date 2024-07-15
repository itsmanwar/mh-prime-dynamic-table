export interface DynamicTable<T> {
    headers: TableHeader[];
    expandableHeaders: TableHeader[];
    data: T[];
    dataCount: number;
}

export interface TableHeader {
    name: string;
    dataType: string;
    fieldName: string;
    expandable: boolean | null;
    filterField: string;
    isSortable: boolean;
    isFilterable: boolean;
    filterEnums?: FilterEnum[];
    objectTypeValueField?: number;
}
export interface HeaderGroups {
    headers: TableHeader[];
    expandableHeaders: TableHeader[];
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