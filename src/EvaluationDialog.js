import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import EvaluationChart from './EvaluationChart.js';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';

export default class EvaluationDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false
        }
    }

    getSnapshotBeforeUpdate(prevProps, prevState) {
        if (prevProps.open != this.props.open) {
            this.setState({ open: this.props.open });
        }
    }

    render() {

        return (
            <Dialog
                open={this.state.open}
                onClose={this.props.close}
                aria-labelledby="alert-dialog-title"
                maxWidth={false}
            >
                <DialogTitle id="alert-dialog-title">
                    <span style={{position: 'relative', top:'10px'}}>Evaluation Chart</span>
                    <IconButton onClick={this.props.close} style={{color: '#009688', float: 'right'}}>
                        <Icon>close</Icon>
                    </IconButton>
                </DialogTitle>
                    <EvaluationChart data={this.props.data}></EvaluationChart>
            </Dialog>
        )
    }
}
