// Type definitions for @ag-grid-community/core v23.0.2
// Project: http://www.ag-grid.com/
// Definitions by: Niall Crosby <https://github.com/ag-grid/>
import { Component } from "../widgets/component";
import { RowNode } from "../entities/rowNode";
import { DragItem } from "../dragAndDrop/dragAndDropService";
import { Beans } from "./beans";
import { Column } from "../entities/column";
export interface IRowDragItem extends DragItem {
    defaultTextValue: string;
}
export declare class RowDragComp extends Component {
    private readonly beans;
    private readonly rowNode;
    private readonly column;
    private readonly cellValue;
    constructor(rowNode: RowNode, column: Column, cellValue: string, beans: Beans);
    private postConstruct;
    private getSelectedCount;
    private checkCompatibility;
    private addDragSource;
}
