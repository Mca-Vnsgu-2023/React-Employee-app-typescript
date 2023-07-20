import React, { useState, useEffect } from 'react'
import { ErrorMessage, FieldArray, FormikProvider, useFormik } from 'formik';
import * as Yup from 'yup';
import EmployeeService from '../../Services/employeeService';
import TextField from '@mui/material/TextField';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Button from '@mui/material/Button';
import { MenuItem } from '@mui/material';
import { FormHelperText } from '@mui/material'
import InputLabel from '@mui/material/InputLabel';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { IFormValues } from './types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

export interface UpdateProps {
    empid: number | undefined;
    handleClose:  (open: any) => void;
    handleAfterSubmit:()=>void;
}

const validationSchema = Yup.object().shape({
    name: Yup.string().min(3, "It's too short").required("Name is Required"),
    email: Yup.string().email("Enter valid email").required("Email is Required"),
    gender: Yup.string().oneOf(["Male", "Female", "Other"], "Required").required("Gender is Required"),
    dob: Yup.string().required("Dob is Required"),
    hobby:Yup.array().required("Hobby is Required.").min(2,"At list two hobby is require."),
    designation: Yup.string().required("Designation is Required"),
    phoneno: Yup.string().required("Phoneno is Required"),
    employeeSkill: Yup.array()
        .of(Yup.object().shape({ skillname: Yup.string().min(2, "At list one skill is require.").required("Skill is Required.") }))
});

const empHobby = ['Reading', 'Writing', 'Programming', 'Dancing']

const AddUpdateForm = (props: UpdateProps) => {

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            gender: '',
            dob: '',
            hobby: '',
            designation: '',
            phoneno: '',
            employeeSkill: [
                {
                    skillid: 0,
                    skillname: "",
                    id: 0
                }]
        },
        validationSchema,
        onSubmit: values => {
          onFormSubmit(values)
        },
      });

    const { empid,handleAfterSubmit,handleClose } = props
    const [inputs, setInputs] = useState({
        name: "",
        email: "",
        gender: "",
        dob: "",
        hobby: "",
        designation: "",
        phoneno: "",
        employeeSkill: [
            {
                skillid: 0,
                skillname: "",
                id: 0
            }]
    });

    useEffect(() => {
        if (empid) {
            EmployeeService.getByIdEmployee(empid)
                .then(res => {
                    const data = {
                        ...res.data,
                        hobby: res.data.hobby.split(',')
                    }
                    setInputs(data)
                    formik.setValues(data)
                })
        }
    }, [empid])

    const createEmp = (data:IFormValues) => {
        EmployeeService.addEmployee(data)
            .then((response) => {
                console.log(response)
                handleClose(false);
                handleAfterSubmit();
            })
            .catch((error) => {
                console.log(error)
            })
        console.log(inputs);
    }

    const updateEmp = (data:IFormValues) => {
        if(empid){
            EmployeeService.updateEmployee(empid, data)
            .then((response) => {
                console.log(response)
                handleClose(false);
                handleAfterSubmit();
            })
            .catch((error) => {
                console.log(error)
            })
        console.log(inputs);
        }
    }

    const onFormSubmit = (employess:IFormValues) => {
        const emp = { ...employess }
        emp.hobby = [emp.hobby].join(',')
         return empid == 0 ? createEmp(emp) : updateEmp(emp)
    }

	const {handleSubmit} = formik
        
    return (
                <form onSubmit={handleSubmit}>
                    <TextField fullWidth name="name" label='Name'
                        placeholder="Enter your name" 
                        onChange={formik.handleChange}
                        value={formik.values.name}
                        error={Boolean(formik.errors.name) && Boolean(formik.touched.name)}
                        helperText={Boolean(formik.touched.name) && formik.errors.name}
                    />
                    <br /><br />
                    <TextField fullWidth name="email" label='Email'
                        placeholder="Enter your email" onChange={formik.handleChange}
                        value={formik.values.email}
                        error={Boolean(formik.errors.email) && Boolean(formik.touched.email)}
                        helperText={Boolean(formik.touched.email) && formik.errors.email}
                    />
                    <br /><br />
                    <FormControl>
                        <FormLabel id="demo-row-radio-buttons-group-label">Gender</FormLabel>
                        <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label" 
                            name="row-radio-buttons-group" onChange={formik.handleChange}
                            value={formik.values.gender}>
                            <FormControlLabel value="Female" name="gender" control={<Radio />} label="Female" />
                            <FormControlLabel value="Male" name="gender" control={<Radio />} label="Male" />
                            <FormControlLabel value="other" name="gender" control={<Radio />} label="Other" />
                        </RadioGroup>
                    </FormControl>
                    <FormHelperText sx={{ color: "red" }}>        
                        {formik.errors.gender}
                    </FormHelperText>
                    <TextField fullWidth name="dob" type="date"
                        onChange={formik.handleChange}
                        value={formik.values.dob} 
                        error={Boolean(formik.errors.dob) && Boolean(formik.touched.dob)}
                        helperText={Boolean(formik.touched.dob) && formik.errors.dob}
                        />
                    <br /><br />

                    <FormControl sx={{ m: 1, width: 545 }} >
                        <InputLabel id="demo-multiple-checkbox-label">Hobby</InputLabel>
                        <Select
                            error={Boolean(formik.errors.hobby)&& Boolean(formik.touched.hobby)}
                            labelId="demo-multiple-checkbox-label"
                            id="demo-multiple-checkbox"
                            name="hobby"
                            multiple
                            value={formik.values.hobby|| []}
                            onChange={formik.handleChange}
                            input={<OutlinedInput label="Hobby" />}
                            renderValue={(selected) => {
                                if (Array.isArray(selected)) {
                                    return selected.join(" ,")
                                }
                                return null
                            }}
                            MenuProps={MenuProps}
                        >
                            {empHobby.map((h) => (
                                <MenuItem key={h} value={h}>
                                    <Checkbox checked={formik.values.hobby.indexOf(h) > -1} />
                                    <ListItemText primary={h} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormHelperText sx={{ color: "red" }}>
                        {formik.errors.hobby}
                    </FormHelperText>
                    <br /><br />

                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Designation</InputLabel>
                        <Select 
                            error={Boolean(formik.errors.designation) && Boolean(formik.touched.designation)}
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label="Designation"
                            name="designation"
                            value={formik.values.designation}
                            onChange={formik.handleChange}
                        >
                            <MenuItem value="Trainee">Trainee</MenuItem>
                            <MenuItem value="Jr.Developer">Jr.Developer</MenuItem>
                            <MenuItem value="Sr.Developer">Sr.Developer</MenuItem>
                        </Select>
                    </FormControl>
                    <FormHelperText sx={{ color: "red" }} >        
                        {Boolean(formik.touched.designation) && formik.errors.designation}
                    </FormHelperText>
                    <br /><br />
                    <TextField fullWidth name="phoneno" label='phoneno'
                        placeholder="Enter your phoneno" 
                        onChange={formik.handleChange}
                        value={formik.values.phoneno} 
                        error={Boolean(formik.errors.phoneno) && Boolean(formik.touched.phoneno)}
                        helperText={Boolean(formik.touched.phoneno) && formik.errors.phoneno}
                         />
                    <br /><br />

                    <FormikProvider value={formik}>
                    <FieldArray name={'employeeSkill'}>
                            {arrayHelpers => (
                                <div>
                                    {formik.values.employeeSkill && formik.values.employeeSkill.length > 0 ? (
                                        formik.values.employeeSkill.map((skill, index) => (
                                            <div key={index}>
                                                <TextField style={{ width: '70%' }}
                                                    name={`employeeSkill.${index}.skillname`}
                                                    placeholder="Enter your skill"
                                                    value={formik.values.employeeSkill[index].skillname || []}
                                                    onChange={formik.handleChange}
                                                    error={Boolean(formik.errors.employeeSkill)&& Boolean(formik.touched.employeeSkill)}
                                                   
                                                />

                                                <Button style={{ margin: '15px', marginTop: '10px' }}
                                                    startIcon={<FontAwesomeIcon icon={faPlus} />}
                                                    variant='outlined'
                                                    type="button"
                                                    onClick={() => arrayHelpers.insert(index, '')} // insert an empty string at a position
                                                >
                                                </Button>


                                                <Button
                                                    startIcon={<FontAwesomeIcon icon={faMinus} />}
                                                    variant='outlined' color="error"
                                                    type="button"
                                                    onClick={() => arrayHelpers.remove(index)} // remove a skill from the list
                                                >
                                                </Button>
                                               
                                                <div>
                                                   <ErrorMessage name={`employeeSkill.${index}.skillname`} />
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <Button variant='contained' type="button" onClick={() => arrayHelpers.push('')}>
                                            Add Skill
                                        </Button>
                                    )}
                                </div>
                            )}
                        </FieldArray>
                    </FormikProvider>
                      <br/><br/>                  
                    <Button type="submit" variant="contained" >Save</Button>
                </form>
  
      
    )
}

export default AddUpdateForm