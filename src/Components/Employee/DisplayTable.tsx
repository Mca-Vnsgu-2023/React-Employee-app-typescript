import * as React from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import { visuallyHidden } from '@mui/utils';
import Container from '@mui/material/Container';
import { useState, useEffect } from 'react';
import EmployeeService from '../../Services/employeeService';
import Button from '@mui/material/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import Swal from 'sweetalert2'
import MyDialogs from '../../DialogsBox/MyDialogs';
import AddUpdateForm from './addUpdateForm';
import AddDialog from './addDialog';
import AddEditUseFormik from './addEditUseFormik';
import { IEmployeeQuery, SortOrder } from './types';
import { Directions, Search } from '@mui/icons-material';
import { number } from 'yup/lib/locale';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Collapse } from '@mui/material';

interface Data {
  id: number;
  name: string;
  email: string;
  gender: string;
  dob: string;
  hobby: string;
  designation: string;
  phoneno: string;
  action: any;
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}
type Order = 'asc' | 'desc';
function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (
    a: { [key in Key]: number | string },
    b: { [key in Key]: number | string },
  ) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
  if (Array.isArray(array)) {
    const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);

    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) {
        return order;
      }
      return a[1] - b[1];
    });

    return stabilizedThis.map((el) => el[0]);
  }
  return []
}

interface HeadCell {
  id: keyof Data;
  label: string;
}

const headCells: readonly HeadCell[] = [
  {
    id: 'id',
    label: 'Id',
  },
  {
    id: 'name',
    label: 'Name',
  },
  {
    id: 'email',
    label: 'Email',
  },
  {
    id: 'gender',
    label: 'Gender',
  },
  {
    id: 'dob',
    label: 'Date Of Birth',
  },
  {
    id: 'designation',
    label: 'Designation',
  },
  {
    id: 'action',
    label: 'Action',
  }
];

interface EnhancedTableProps {
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, onRequestSort } =
    props;
  const createSortHandler =
    (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead sx={{ backgroundColor: 'lightskyblue'}}>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell 
            key={headCell.id} 
            align='center' 
            padding='normal'
            sx={{fontFamily:'sans-serif' ,fontWeight:700 ,fontSize:17}}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>

        ))}
      </TableRow>
    </TableHead>
  );
}

export default function EnhancedTable() {

  const [open, setOpen] = React.useState(false);
  const showOrHideEmployeeDialog = (open: boolean) => {
    setOpen(open);
  }

  const [EmployeeDetails, setEmployeeDetails] = useState([])
  const [editEmp, seteditEmp] = useState<number>()

  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof Data>('name');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(3);
  const [totalRecord, settotalRecord] = React.useState(5);
  const [openArrow, setOpenArrow] = React.useState(-1);

  const handleExpandClick = (i:number) => {
    setOpenArrow(openArrow === i ? -1 : i);
  };

  useEffect(() => {
    fetchAllEmployee();
  }, [page, rowsPerPage, order, orderBy])

  var searchtext: string = ""

  const employeeQuery = () => {
    const query = {
      SearchText: searchtext,
      pageNo: page + 1,
      pageSize: rowsPerPage,
      sortOrder: order,
      sortColumn: orderBy,
    } as IEmployeeQuery
    return query
  }

  const Searching = (e: any) => {
    searchtext = e.target.value
    fetchAllEmployee()
  }

  const fetchAllEmployee = () => {
    const data = employeeQuery()
    EmployeeService.getAllEmployees(data)
      .then((response) => {
        if (response.data) {
          setEmployeeDetails(response.data.items)
          settotalRecord(response.data.totalRecords)
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }

  // const getByIdEmp = (id: number) => {
  //   setOpenArrow(!openArrow)
  //   EmployeeService.getByIdEmployee(id)
  //     .then((response) => {
  //       setEmployeeDetails(response.data)
  //     })
  //     .catch((error) => {
  //       console.log(error)
  //     })
  // }

  const deleteEmp = (id: number) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this.!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it..!'
    }).then((result) => {
      if (result.isConfirmed) {
        EmployeeService.deleteEmployee(id)
        Swal.fire(
          'Deleted!',
          'Your file has been deleted.',
          'success'
        )
        fetchAllEmployee();
      } else if (
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire(
          'Cancelled',
          'Your data is safe :)',
          'error'
        )
      }
    })
  }
  
  const updateEmp = (id: number) => {
    showOrHideEmployeeDialog(true);
    console.log(id)
    seteditEmp(id)
  }

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAfterSubmit = () => {
    fetchAllEmployee()
  }

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, EmployeeDetails.length - page * rowsPerPage);

  return (
    <Container maxWidth="xl">
      <AddDialog handleAfterSubmit={handleAfterSubmit} />
      <TextField sx={{ width: '100%' }} id="standard-basic" label="Search Here.." placeholder="Ex.John" variant="standard" onKeyUp={Searching} />
      <br /><br />
      <Box sx={{ width: '100%' }}>
        <Paper sx={{ width: '100%', mb: 2 }}>

          <TableContainer component={Paper}>
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
            >
              <EnhancedTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                rowCount={EmployeeDetails.length}
              />
              <TableBody>

                {stableSort(EmployeeDetails, getComparator(order, orderBy))
                  .map((e, index) => {
                    return (
                      <React.Fragment key={"row" + index}>
                      <TableRow>
                        <TableCell align="center">{e.id}</TableCell>
                        <TableCell align="center">{e.name}</TableCell>
                        <TableCell align="center">{e.email}</TableCell>
                        <TableCell align="center">{e.gender}</TableCell>
                        <TableCell align="center">{e.dob}</TableCell>
                        <TableCell align="center">{e.designation}</TableCell>
                        <TableCell align="center">
                          <Button startIcon={<FontAwesomeIcon icon={faEdit} />} sx={{ color: "green" }} onClick={() => updateEmp(e.id as number)}></Button>
                          <Button startIcon={<FontAwesomeIcon icon={faTrashAlt} />} sx={{ color: "red" }} onClick={() => deleteEmp(e.id as number)}></Button>
                          <IconButton
                            aria-label="expand row"
                            size="small"
                            onClick={() => handleExpandClick(index)}
                          >
                            {openArrow===index ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon /> }
                          </IconButton>
                        </TableCell>
                      </TableRow>
                        <TableRow>
                          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
                            <Collapse in={openArrow===index} timeout="auto" unmountOnExit>
                              <TableRow>
                                <TableCell></TableCell>
                                <TableCell align="center">Hobby: {e.hobby}</TableCell>
                                <TableCell align="center">PhoneNo:{e.phoneno}</TableCell>
                                </TableRow>
                            </Collapse>
                          </TableCell>
                        </TableRow>
                      </React.Fragment>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow >

                  </TableRow>
                )}
          
              </TableBody>
            </Table>
          </TableContainer>

          <MyDialogs open={open} handleClose={() => showOrHideEmployeeDialog(false)} title={'Edit Employee'}>
            <AddUpdateForm empid={editEmp} handleClose={(open1) => showOrHideEmployeeDialog(open1)} handleAfterSubmit={handleAfterSubmit} />
            {/* <AddEditUseFormik empid={editEmp} handleClose={(open1) => showOrHideEmployeeDialog(open1)} handleAfterSubmit={handleAfterSubmit} /> */}
          </MyDialogs>

          <TablePagination
            rowsPerPageOptions={[3, 5, 10, 25]}
            component="div"
            count={totalRecord}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Box>
    </Container>
  );
}



