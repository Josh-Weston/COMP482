import React from 'react';
import ReactDOM from 'react-dom';
import TopBar from './TopBar.js';
import Header from './Header.js';
import RoleDialog from './RoleDialog.js';
import SummaryTable from './SummaryTable.js';
import ProjectDialog from './ProjectDialog.js';
import Message from './Message.js';
import EditProjectDialog from './EditProjectDialog.js';
import DeleteDialog from './DeleteDialog.js';
import FilterDialog from './FilterDialog.js';
import EvaluationDialog from './EvaluationDialog.js';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            role: 'Project Manager',
            data: this.props.data, // What is shown to user based on filters
            allData: this.props.data, // Maintains record of projects added/deleted during runtime
            showRoleDialog: false,
            showProjectDialog: false,
            snackBarMessage: null,
            showSnackBar: false,
            showEditProjectDialog: false,
            editProject: {},
            showDeleteDialog: false,
            showFilterDialog: false,
            filterOptions: {column: undefined, options: []},
            sortColumn: undefined,
            sortDirection: undefined,
            showEvaluationDialog: false
        };
        this.projectIndex = 0;
        this.deleteProjectIndex = null;
        this.printSummary = this.printSummary.bind(this);
        this.captureEvents = this.captureEvents.bind(this);
        this.addProject = this.addProject.bind(this);
        this.editProject = this.editProject.bind(this);
        this.editProjectUpdate = this.editProjectUpdate.bind(this);
        this.messageGateway = this.messageGateway.bind(this);
        this.deleteProjectAlert = this.deleteProjectAlert.bind(this);
        this.deleteProject = this.deleteProject.bind(this);
        this.sortData = this.sortData.bind(this);
        this.promptFilter = this.promptFilter.bind(this);
        this.filterData = this.filterData.bind(this);
    }

    captureEvents(eventName, eventObj) {
        switch (eventName) {
            case 'printSummary':
                this.printSummary();
                break;
            case 'newProject':
                this.setState({showProjectDialog: true});
                break;
            case 'evaluationChart':
                this.setState({showEvaluationDialog: true});
        }
    }

    printSummary() {
        let printDate = new Date();
        document.getElementById('print-title').textContent = `Innovation and Analytics Portfolio (${printDate.toDateString()})`;
        window.print();
    }

    addProject(details) {

        let newProject = {
            "Project Name": details.name,
            "Company" : details.company,
            "Project Manager": 'Josh Weston',
            "Status": details.status,
            "Requested Completion Date": details.requestedCompletion,
            "Project Sponsor": details.sponsor,
            "Project Description": details.description,
            "Update": details.update,
            "Evaluation Big": 1,
            "Evaluation Fast": 1,
            "Evaluation Score": 2,
            "Index": this.projectIndex
        }

        this.projectIndex++;

        // Push to state array. Use this syntax to avoid conflict.
        this.setState(prevState => ({
            data: [...prevState.data, newProject],
            allData: [...prevState.data, newProject]
        }));
    }

    editProject(projectIndex) {
        let editProject = this.state.data.find(el => el['Index'] === projectIndex);
        this.setState({ showEditProjectDialog: true, editProject });
    }

    editProjectUpdate(projectIndex, projectDetails) {

        let editProjectIndex = this.state.data.findIndex(el => el['Index'] === projectIndex);
        let dataState = Object.assign(this.state.data);
        dataState[editProjectIndex] = Object.assign({}, dataState[editProjectIndex], projectDetails);
        this.setState({
            data: dataState,
            allData: dataState
        });
        this.messageGateway( {type: 'success', message: 'Project edited successfully!' });
    }

    deleteProjectAlert(projectIndex) {
        this.deleteProjectIndex = projectIndex;
        this.setState({ showDeleteDialog: true });
    }

    deleteProject(response) {
        // Remove from the data and trigger a render
        if (response === true) {
            this.setState( {
                data: this.state.data.filter(el => el['Index'] != this.deleteProjectIndex),
                allData: this.state.data.filter(el => el['Index'] != this.deleteProjectIndex)
            });

            this.messageGateway( {type: 'success', message: 'Project deleted successfully!' });
            this.setState({showEditProjectDialog: false}) // Close dialog if deleting, otherwise it stays open
        }
        this.deleteProjectIndex = null;
    }

    messageGateway(message) {
        this.setState({snackBarMessage: message, showSnackBar: true});
    }

    sortData(columnName, direction) {
        this.setState({
            data: this.state.data.sort((a, b) => a[columnName] < b[columnName] ? direction : direction * -1),
            sortColumn: columnName,
            sortDirection: direction
        });
    }

    promptFilter(columnName) {

        // We want to show all available values, regardless of current filter
        let options = Array.from(new Set(this.state.allData.map(el => el[columnName])));
        options.unshift('Show All');

        this.setState({
            filterOptions: {column: columnName, options},
            showFilterDialog: true
        });
    }

    filterData(columnName, option) {

        if (option != undefined) {
            if (option === 'Show All') {
                this.setState({
                    data: [...this.state.allData]
                }, upDateSort);
            } else {
                this.setState({
                    data: this.state.allData.filter(el => el[columnName] === option)
                }, upDateSort);
            }
        }

        // Reapply sort if applicable
        function upDateSort() {
            if (this.state.sortColumn != undefined) {
                this.sortData(this.state.sortColumn, this.state.sortDirection);
            }
        }

        this.setState({showFilterDialog: false});
    }

    render() {
        
        this.projectIndex = 0;
        let filteredData = this.state.data.map(el => {el['Index'] = this.projectIndex; this.projectIndex++; return el;}); // This is an anti-pattern, but justified
        
        // Determine what data can be shown to the user
        // In production, the server will determine this for us based on actual permissions
        if (this.state.role === 'Guest') {
            let include = ['Project Name', 'Company', 'Project Manager', 'Status', 'Project Description'];
            filteredData = filteredData.map(record => {
                let filteredObj = {};
                for (let key in record) {
                    if (include.includes(key)) {
                        filteredObj[key] = record[key];
                    }
                }
                return filteredObj;
            });
        }

        // Fields everyone can see
        let columnSet = {
            'columnHeaders': [
                {name: 'Project Name', sortable: true, filterable: false, index: 1},
                {name: 'Company', sortable: true, filterable: true, index: 2},
                {name: 'Project Manager', sortable: true, filterable: true, index: 3},
                {name: 'Status', sortable: true, filterable: true, index: 4},
            ],
            'expandedHeaders': [
                {name: 'Project Description', index: 1}
            ]
        }

        // Additional fields if not a Guest User
        if (this.state.role != 'Guest') {
            columnSet.columnHeaders.push({name: 'Evaluation Score', sortable: true, filterable: false, index: 5});
            columnSet.columnHeaders.push({name: 'Requested Completion Date', sortable: true, filterable: false, index: 6});
            columnSet.expandedHeaders.push({name: 'Update', index: 2});
        }

        // Features the user can access
        let featureSet = {
            print: true,
            viewEvaluationsChart: false,
            addNewProject: false,
            editEvaluations: false,
            deleteProject: false,
            editProject: false,
            viewUpdate: false 
        }

        switch (this.state.role) {
            case "Vice President":
                featureSet = Object.assign({}, featureSet, {viewEvaluationsChart: true, viewUpdate: true});
                break;
            case "Director":
                featureSet = Object.assign({}, featureSet, {viewEvaluationsChart: true, editEvaluations: true, viewUpdate: true});
                break;
            case "Project Manager":
                featureSet = Object.assign({}, featureSet, {viewEvaluationsChart: true, addNewProject: true, deleteProject: true, editProject: true, viewUpdate: true});
                break;
            default:
                break;
        }

        return (
            <div>
                <RoleDialog open={this.state.showRoleDialog} close={(role) => this.setState({showRoleDialog: false, role})} roles={['Vice President', 'Director', 'Project Manager', 'Guest']}></RoleDialog>
                <TopBar role={this.state.role} roleSelect={() => this.setState({showRoleDialog: true})}></TopBar>
                <Header onClick={this.captureEvents} role={this.state.role } featureSet={featureSet}></Header>
                <SummaryTable data={filteredData} columnSet={columnSet} featureSet={featureSet} editProject={this.editProject} sort={this.sortData} filter={this.promptFilter}></SummaryTable>
                <ProjectDialog open={this.state.showProjectDialog} close={() => this.setState({showProjectDialog: false})} addProject={this.addProject} sendMessage={this.messageGateway}></ProjectDialog>
                <Message open={this.state.showSnackBar} snackBarObj={this.state.snackBarMessage} close={() => this.setState({showSnackBar: false})}></Message>
                <EditProjectDialog open={this.state.showEditProjectDialog} featureSet={featureSet} project={this.state.editProject} close={() => this.setState({showEditProjectDialog: false})} deleteProject={this.deleteProjectAlert} editProjectUpdate={this.editProjectUpdate}></EditProjectDialog>
                <DeleteDialog open={this.state.showDeleteDialog} close={() => this.setState({showDeleteDialog: false})} response={this.deleteProject}></DeleteDialog>
                <FilterDialog open={this.state.showFilterDialog} close={this.filterData} filterOptions={this.state.filterOptions}></FilterDialog>
                <EvaluationDialog data={filteredData} open={this.state.showEvaluationDialog} close={() => this.setState({showEvaluationDialog: false})}></EvaluationDialog>
            </div>
        )
    }
}

async function init() {
    let allData = await fetch('./data/starting.json').then(res => res.json()).then(res => res);
    ReactDOM.render(<App data={allData}></App>, document.getElementById('react-app'));
}

init();