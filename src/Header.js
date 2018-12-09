import React from 'react';
import styled, { css } from 'styled-components';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';

const Title = styled.div`
    font-size: 50px;
    margin: 50px;
    color: #707070;   
`;

const Ribbon = styled.div`
    height: 50px;
    background-color: #E0E0E0;
    padding: 0px 40px;
    line-height: 45px;
`;

const XIconButton = styled(Button)`
    && {
        height: 28px;
        width: 28px;
        background-color: white;
        min-height: auto; 
    }

    ${props => props.margin && css`
        && {
            margin-left: 10px;
        }
    `}
`;

const XButton = styled(Button)`
    && {
        color: white;
        background-color: #009688;
        float: right;
        margin-top: 7px;
    }

    &&:hover {
        background-color: #01BFAE;
    }
`;

export default class Header extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Title>Innovation and Analytics Portfolio</Title>
                <Ribbon>
                    <Tooltip title="Print Summary View" placement="top" onClick={e => this.props.onClick("printSummary", e)}>
                        <XIconButton variant="fab">
                            <i class="material-icons active-color icon-button">print</i>
                        </XIconButton>
                    </Tooltip>
                    {this.props.featureSet.viewEvaluationsChart === true &&
                        <Tooltip title="View Evaluation Chart" placement="top" onClick={e => this.props.onClick("evaluationChart", e)}>
                            <XIconButton variant="fab" margin>
                                <i class="material-icons active-color icon-button">insert_chart_outlined</i>
                            </XIconButton>
                        </Tooltip>
                    }
                    {this.props.featureSet.addNewProject === true &&
                        <Tooltip title="Add a New Project" placement="top" onClick={e => this.props.onClick("newProject", e)}>
                            <XButton variant="contained">+ New Project</XButton>
                        </Tooltip>
                    }
                </Ribbon>
            </div>
        )
    }
}
  