import React from 'react';
import styled from 'styled-components';
import Tooltip from '@material-ui/core/Tooltip';

const TopNav = styled.div`
    height: 50px;
    padding: 0px 40px 0px 40px;
    box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12);
`;

const BadgeContainer = styled.div`
    float: right;
    color: #707070;
    font-size: 14px;
    display: flex;
    align-items: center;
    line-height: 50px;
`;

const UserName = styled.span`
    margin-left: 13px;

    span {
        font-weight: bold;
        color: #009688;
        transition: opacity .2s ease;
    }

    span: hover {
        cursor: pointer;
        opacity: .7;
    }
`;

export default class TopBar extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <TopNav>
                <BadgeContainer>
                    <i class="material-icons" style={{color: 'black'}}>assignment_ind</i>
                    <UserName>
                        Josh Weston ( Viewing as:&nbsp;
                            <Tooltip title="Change User Role" placement="bottom">
                                <span onClick={this.props.roleSelect}>{this.props.role}</span>
                            </Tooltip>
                        &nbsp;)
                    </UserName>
                </BadgeContainer>
            </TopNav>
        )
    }
}
