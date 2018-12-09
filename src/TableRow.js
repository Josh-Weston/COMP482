import React from 'react';
import styled, { css } from 'styled-components';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import Tooltip from '@material-ui/core/Tooltip';

// Table row is made-up of a top part and a bottom part (hidden until clicked)
const RowTop = styled.div`
    display: table-row;
    color: inherit;
    height: 48px;
    outline: none;
    vertical-align: middle;
`;

const RowBottom = styled.div`
    display: table-row;
`;

const RowBottomCell = styled.td`
    font-size: 0px;
`;

const RowBottomContents = styled.div`
    font-size: inherit;
    height: 0px;
    opacity: 0;
    transition: opacity .2s ease, height .2s ease;
    display: table;
    padding: 00px 56px 0px 30px;
    width: 70%;

    ${props => props.visible === true && css`
        height: 150px;
        opacity: 1;
        font-size: 0.8125rem;
        padding-top: 20px;
    `}
`;

const RowCell = styled.div`
    display: table-cell;
    color: rgba(0, 0, 0, 0.87);
    font-size: 0.8125rem;
    font-weight: 400;
    padding: 4px 24px 4px 24px;
    text-align: left;
    border-bottom: 1px solid rgba(224, 224, 224, 1);
    vertical-align: inherit;
    position: relative;
`;

const RowCellHeader = styled.div`
    color: var(--active-color);
    font-weight: bold;
    transition: opacity .2s ease;
    position: relative;
    padding-left: 15px;
    min-width: 200px;

    &:hover {
        cursor: pointer;
        opacity: .7;
    }
`;

const TableBody = styled.div`
    display: table-row-group;
    vertical-align: middle;
`;

const Arrow = styled.i`
    position: absolute;
    top: -5px;
    left: -15px;
    transition: transform .2s ease;
`;

const TableExpandedCell = styled.div`
    display: table-cell;
    font-weight: 200;

    ${props => props.header && css`
        color: #4D4F5C;
        padding-right: 20px;
        font-weight: normal;
        width: 100px;
    `}

`;

const XIconButton = styled(IconButton)`
    && {
        position: absolute;
        top: -3px;
        left: -55px;
    }
`;

const TableExpandedRow = styled.div`
    display: table-row;
`;

const EvaluationBarBG = styled.div`
    background-color: lightgray;
    width: 100%;
    height: 10px;
`

const EvaluationBar = styled.div`
    background-color: ${props => props.width >= 50 ? '#4caf50' : '#f44336'};
    width: ${props => props.width}%;
    height: 10px;
`

export default class TableRow extends React.Component {
    constructor(props) {
        super(props);

        this.handleRowClick = this.handleRowClick.bind(this);
        this.state = {
            open: false
        }
    }

    handleRowClick(e) {

        let arrow = e.target.querySelector('i');

        if (arrow === null) {
            arrow = e.target.parentNode.querySelector('i');
        }

        arrow.classList.toggle('arrow-open');

        // Toggle State
        this.setState({ open: !this.state.open });
    }

    render() {
        let cells = this.props.cells.map((el, i) => {
            if (i === 0) {
                return (
                    <RowCell>
                        {(this.props.featureSet.editProject || this.props.featureSet.editEvaluations) && 
                            <Tooltip title="Edit This Project" placement="top" onClick={this.props.editProject}>
                                    <XIconButton className={'edit-button'} style={{color: '#009688'}}>
                                        <Icon>edit</Icon>
                                    </XIconButton>
                            </Tooltip>
                        }
                        <RowCellHeader onClick={this.handleRowClick}>
                            <Arrow className={'material-icons'}>keyboard_arrow_down</Arrow>{el.value}
                        </RowCellHeader>
                    </RowCell>
                )
            } else if (el.name === 'Evaluation Score') {
                return (
                    <RowCell>
                        <Tooltip title={`Total Score: ${el.value}`} placement="top"> 
                            <EvaluationBarBG>
                                <EvaluationBar width={el.value*10}></EvaluationBar>
                            </EvaluationBarBG>
                        </Tooltip>
                    </RowCell>
                )
            } else {
                return <RowCell>{el.value}</RowCell>
            }
        });

        // Each TableRow is actually a TableBody
        // Camelcase colSpan, https://reactjs.org/docs/dom-elements.html
        return (
            <TableBody>
                <RowTop>
                    {cells}
                </RowTop>
                <RowBottom>
                    <RowBottomCell colSpan={6}>
                        <RowBottomContents visible={this.state.open === true}>
                            <TableExpandedRow>
                                <TableExpandedCell header>DESCRIPTION:</TableExpandedCell>
                                <TableExpandedCell>{this.props.expanded[0]}</TableExpandedCell>
                            </TableExpandedRow>
                            {this.props.featureSet.viewUpdate === true &&
                                <TableExpandedRow>
                                    <TableExpandedCell header>UPDATE:</TableExpandedCell>
                                    <TableExpandedCell>{this.props.expanded[1]}</TableExpandedCell>
                                </TableExpandedRow>
                            }
                        </RowBottomContents>
                    </RowBottomCell>
                </RowBottom>
            </TableBody>
        )
    }
}
