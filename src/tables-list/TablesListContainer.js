import {connect} from 'react-redux';
import TablesList from './TablesList';
import {addTable, copyTable, editTable, deleteTable} from '../store/actions/tables.js';

const mapStateToProps = state => {
  return {
      tablesList: state.tablesList
  };
};

const mapDispatchToProps = dispatch => {
    return {
        addTable: table => dispatch(addTable(table)),
        copyTable: tableId => dispatch(copyTable(tableId)),
        editTable: table => dispatch(editTable(table)),
        deleteTable: tableId => dispatch(deleteTable(tableId))
    }
};

const TablesListContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(TablesList)

export default TablesListContainer;