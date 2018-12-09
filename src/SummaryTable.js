import React from 'react';
import styled from 'styled-components';
import Paper from '@material-ui/core/Paper';
import TableRow from './TableRow.js';
import Tooltip from '@material-ui/core/Tooltip';

const XPaper = styled(Paper)`
    && {
        width: 90%;
        margin: 0 auto;
        margin-top: 40px;
        max-width: 1700px;
        min-width: 1200px;
    }
`;

const Table = styled.div`
    display: table;
    width: 100%;
`;

const TableHead = styled.div`
    display: table-header-group;
`;

const TableHeadRow = styled.div`
    display: table-row;
    height: 56px;
    color: inherit;
    display: table-row;
    outline: none;
    vertical-align: middle;
`;

const TableHeadCell = styled.div`
    display: table-cell;
    padding: 4px 24px 4px 24px;
    text-align: left;
    border-bottom: 1px solid rgba(224, 224, 224, 1);
    vertical-align: inherit;
    color: rgba(0, 0, 0, 0.54);
    font-size: 0.75rem;
    font-weight: 500;
`;

const TableHeadName = styled.div`
    vertical-align: middle;
    line-height: 20px;
    display: inline-block;
`;

const MIcon = styled.i`
    float: right;
    font-size: 20px;
    color: #009688;
    display: inline;
    vertical-align: middle;

    &: hover {
        cursor: pointer;
        opacity: .7;
    }
`;

export default class SummaryTable extends React.Component {
    constructor(props) {
        super(props);
        this.sortedColumn = {
            name: undefined,
            direction: 1,
        };
        this.sortColumn = this.sortColumn.bind(this);
    }

    sortColumn(columnName) {
        if (this.sortedColumn.name === columnName) {
            this.sortedColumn.direction *= -1;       
        } else {
            this.sortedColumn.name = columnName,
            this.sortedColumn.direction = 1
        }

        this.props.sort(this.sortedColumn.name, this.sortedColumn.direction);
    }

    render() {

        let columns = this.props.columnSet.columnHeaders.sort((a, b) => a.index < b.index ? -1 : 1),
            tableHeaders = columns.map(column => (
                    <TableHeadCell>
                        <TableHeadName>{column.name}</TableHeadName>
                        {column.sortable === true ? <Tooltip onClick={() => this.sortColumn(column.name)} title={'Sort Column'} placement="top"><MIcon className={'material-icons'}>sort_by_alpha</MIcon></Tooltip> : ''}
                        {column.filterable === true ? <Tooltip onClick={() => this.props.filter(column.name)} title={'Filter Column'} placement="top"><MIcon className={'material-icons'}>filter_list</MIcon></Tooltip>: '' }
                    </TableHeadCell>
                )
            ),
            expandedHeaders = this.props.columnSet.expandedHeaders.sort((a, b) => a.index < b.index ? -1 : 1),
            tableRows = this.props.data.map(el => {
                let cells = columns.map(column => ({name: column.name, value: el[column.name]})); // For each record, use the columns to create an array in the correct order
                let expanded = expandedHeaders.map(column => el[column.name]);
                return <TableRow cells={cells} expanded={expanded} featureSet={this.props.featureSet} editProject={() => this.props.editProject(el['Index'])}></TableRow>
            });

        return (
            <XPaper id="summary-container">
                <Table>
                    <TableHead>
                        <TableHeadRow>
                            {tableHeaders}
                        </TableHeadRow>
                    </TableHead>
                        {tableRows}
                </Table>
            </XPaper>
        )
    }
}