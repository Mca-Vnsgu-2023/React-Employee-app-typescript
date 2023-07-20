import * as React from 'react';
import Button from '@mui/material/Button';
import AddUpdateForm from './addUpdateForm';
import MyDialogs from '../../DialogsBox/MyDialogs';
import AddEditUseFormik from './addEditUseFormik'


interface Props{
    handleAfterSubmit:()=>void,
}
const CustomizedDialogs = (props:Props) => {
    const {handleAfterSubmit}=props
    const [open, setOpen] = React.useState(false);
    //const handleClickOpen = () => setOpen(true);
    //const handleClose = () =>  setOpen(false);

    const showOrHideEmployeeDialog = (open: boolean) => {
        setOpen(open);
    }

    return (
        <div>
            <Button variant="contained" style={{ float: 'left', marginBottom: '25px' }} onClick={() => showOrHideEmployeeDialog(true)}>Add Employee</Button>
            <MyDialogs open={open} handleClose={() => showOrHideEmployeeDialog(false)} title={'Add Employee'} >

                <AddUpdateForm empid={0} handleClose={(open1) => showOrHideEmployeeDialog(open1)} handleAfterSubmit={handleAfterSubmit} />
                {/* <AddEditUseFormik empid={0} handleClose={(open1) => showOrHideEmployeeDialog(open1)} handleAfterSubmit={handleAfterSubmit} /> */}
            </MyDialogs>
        </div>
    );
}
export default CustomizedDialogs
