import React from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import styled from 'styled-components';

const theme = createMuiTheme({
    palette: {
        primary: { main: '#009688' }
    },
});

const XDialogActions = styled.div`
    margin: 8px 4px;
`;

export default class EditProjectDialog extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            open: this.props.open,
            nameError: false,
            descriptionError: false,
        }
        this.handleClose = this.handleClose.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleProjectEdit = this.handleProjectEdit.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }

    // Props are only applied at time of construction
    getSnapshotBeforeUpdate(prevProps, prevState) {
        if (prevProps.open != this.props.open) {
            this.setState({ open: this.props.open });

            // If we are opening it, set the state to the project being passed-in
            if (this.props.open === true) {
                let project = this.props.project;
                this.setState({
                    name: project['Project Name'],
                    sponsor: project['Project Sponsor'],
                    status: project['Status'],
                    company: project['Company'],
                    description: project['Project Description'],
                    update: project['Update'],
                    requestedCompletion: project['Requested Completion Date'],
                    evaluationBig: project['Evaluation Big'],
                    evaluationFast: project['Evaluation Fast']
                });
            }

        }
    }

    handleClose() {
        this.props.close();
    }

    handleProjectEdit() {

        // Validate required fields
        let exceptions = [];
        if (this.state.name === '') {
            exceptions.push('You need to provide a Project Name');
            this.setState({ nameError: true });
        } else {
            this.setState({ nameError: false });
        }

        if (this.state.description === '') {
            exceptions.push('You need to provide a Project Description');
            this.setState({ descriptionError: true });
        } else {
            this.setState({ descriptionError: false });
        }

        if (exceptions.length > 0) {
            if (exceptions.length > 1) {
                exceptions = exceptions.join('; ');
            } else {
                exceptions = exceptions[0];
            }
            this.props.sendMessage({type: 'error', message: exceptions});
        } else {

            // Send the data back and close the dialog
            let revised = {
                'Company': this.state.company,
                'Evaluation Big': this.state.evaluationBig,
                'Evaluation Fast': this.state.evaluationFast,
                'Evaluation Score': this.state.evaluationBig + this.state.evaluationFast,
                'Project Description': this.state.description,
                'Project Name': this.state.name,
                'Project Sponsor': this.state.sponsor,
                'Requested Completion Date': this.state.requestedCompletion,
                'Status': this.state.status,
                'Update': this.state.update,
            }

            this.props.editProjectUpdate( this.props.project['Index'], revised );
            this.handleClose();
        }

    }

    handleChange(event, name) {
        this.setState({ [name]: event.target.value })
    }

    handleDelete() {
        this.props.deleteProject(this.props.project['Index']);
    }

    render() {
        return (
            <MuiThemeProvider theme={theme}>
                <form>
                    <Dialog
                        disableBackdropClick
                        disableEscapeKeyDown
                        open={this.state.open}
                        maxWidth='md'
                        onEntering={this.handleEntering}
                        aria-labelledby="confirmation-dialog-title">
                        <DialogTitle id="confirmation-dialog-title">Edit Project</DialogTitle>
                        <DialogContent style={{ minWidth: '500px', maxWidth: '500px' }}>
                            <TextField
                                autoFocus
                                required
                                disabled={this.props.featureSet.editProject != true ? true : null}
                                id="standard-required"
                                label="Project Name"
                                value={this.state.name}
                                margin="normal"
                                onChange={event => this.handleChange(event, 'name')}
                                fullWidth
                                error={this.state.nameError}
                            />
                            <FormControl fullWidth margin="normal">
                                <InputLabel htmlFor="sponsor">Project Sponsor</InputLabel>
                                <Select
                                    value={this.state.sponsor}
                                    disabled={this.props.featureSet.editProject != true ? true : null}
                                    onChange={event => this.handleChange(event, 'sponsor')}
                                    IconComponent={props => (<i {...props} className={`material-icons ${props.className}`} style={{ color: 'black' }}>assignment_ind</i>)}
                                    inputProps={{
                                        name: 'sponsor',
                                        id: 'select-sponsor',
                                    }}
                                >
                                    <MenuItem value="No Sponsor"><em>No Sponsor</em></MenuItem>
                                    <MenuItem value={"Kay Tightneck"}>Kay Tightneck</MenuItem>
                                    <MenuItem value={"Dick Weerdly"}>Dick Weerdly</MenuItem>
                                    <MenuItem value={"Scott Chestnut"}>Scott Chestnut</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl fullWidth margin="normal">
                                <InputLabel htmlFor="company">Company</InputLabel>
                                <Select
                                    value={this.state.company}
                                    disabled={this.props.featureSet.editProject != true ? true : null}
                                    onChange={event => this.handleChange(event, 'company')}
                                    inputProps={{
                                        name: 'company',
                                        id: 'select-company',
                                    }}
                                >
                                    <MenuItem value="No Company"><em>No Company</em></MenuItem>
                                    <MenuItem value={"Fry Co."}>French Fry Co.</MenuItem>
                                    <MenuItem value={"Transportation Co."}>Transportation Co.</MenuItem>
                                    <MenuItem value={"Tissue Co."}>Tissue Co.</MenuItem>
                                </Select>
                            </FormControl>
                            <TextField
                                id="requested-completion"
                                label="Requested Completion Date"
                                type="date"
                                margin="normal"
                                fullWidth
                                disabled={this.props.featureSet.editProject != true ? true : null}
                                value={this.state.requestedCompletion}
                                onChange={event => this.handleChange(event, 'requestedCompletion')}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                            <FormControl fullWidth margin="normal">
                                <InputLabel htmlFor="status">Project Status</InputLabel>
                                <Select
                                    value={this.state.status}
                                    disabled={this.props.featureSet.editProject != true ? true : null}
                                    onChange={event => this.handleChange(event, 'status')}
                                    inputProps={{
                                        name: 'status',
                                        id: 'select-status',
                                    }}
                                >
                                    <MenuItem value={"New Project"}>New Project</MenuItem>
                                    <MenuItem value={"Pending"}>Pending</MenuItem>
                                    <MenuItem value={"In-Progress"}>In-Progress</MenuItem>
                                    <MenuItem value={"Closed"}>Closed</MenuItem>
                                    <MenuItem value={"Delayed"}>Delayed</MenuItem>
                                </Select>
                            </FormControl>
                            <TextField
                                id="project-description"
                                label="Project Description"
                                disabled={this.props.featureSet.editProject != true ? true : null}
                                value={this.state.description}
                                onChange={event => this.handleChange(event, 'description')}
                                multiline
                                rows="4"
                                margin="normal"
                                fullWidth
                                error={this.state.descriptionError}
                                required
                            />
                            <TextField
                                id="project-update"
                                label="Project Update"
                                value={this.state.update}
                                disabled={this.props.featureSet.editProject != true ? true : null}
                                onChange={event => this.handleChange(event, 'update')}
                                multiline
                                rows="4"
                                margin="normal"
                                fullWidth
                            />
                            {this.props.featureSet.editEvaluations === true &&
                                <FormControl fullWidth margin="normal">
                                    <InputLabel htmlFor="evaluationBig">Evaluation Score (Big)</InputLabel>
                                    <Select
                                        value={this.state.evaluationBig}
                                        onChange={event => this.handleChange(event, 'evaluationBig')}
                                        inputProps={{
                                            name: 'evaluationBig',
                                            id: 'evaluation-big',
                                        }}
                                    >
                                        <MenuItem value={1}>1</MenuItem>
                                        <MenuItem value={2}>2</MenuItem>
                                        <MenuItem value={3}>3</MenuItem>
                                        <MenuItem value={4}>4</MenuItem>
                                        <MenuItem value={5}>5</MenuItem>
                                    </Select>
                                </FormControl>
                            }
                            {this.props.featureSet.editEvaluations === true &&
                                <FormControl fullWidth margin="normal">
                                    <InputLabel htmlFor="evaluationFast">Evaluation Score (Fast)</InputLabel>
                                    <Select
                                        value={this.state.evaluationFast}
                                        onChange={event => this.handleChange(event, 'evaluationFast')}
                                        inputProps={{
                                            name: 'evaluationFast',
                                            id: 'evaluation-fast',
                                        }}
                                    >
                                        <MenuItem value={1}>1</MenuItem>
                                        <MenuItem value={2}>2</MenuItem>
                                        <MenuItem value={3}>3</MenuItem>
                                        <MenuItem value={4}>4</MenuItem>
                                        <MenuItem value={5}>5</MenuItem>
                                    </Select>
                                </FormControl>
                            }
                        </DialogContent>
                        <XDialogActions>
                            <Button onClick={this.handleDelete} style={{ float: 'left' }} color="secondary" disabled={this.props.featureSet.editProject != true ? true : null}>Delete</Button>
                            <Button onClick={this.handleProjectEdit} style={{ float: 'right' }} color="primary">Save</Button>
                            <Button onClick={this.handleClose} style={{ float: 'right' }} color="primary">Cancel</Button>
                        </XDialogActions>
                    </Dialog>
                </form>
            </MuiThemeProvider>
        )
    }
}
