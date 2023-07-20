import * as React from 'react';
import { useState, useEffect } from 'react';
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
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
import Select from '@mui/material/Select';
import { IFormValues } from './types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons'
import { Style } from '@mui/icons-material';



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
    handleClose: (open: any) => void;
    handleAfterSubmit: () => void
}

const validationSchema = Yup.object().shape({
    name: Yup.string().min(3, "It's too short.").required("Name is Required."),
    email: Yup.string().email("Enter valid email.").required("Email is Required."),
    gender: Yup.string().oneOf(["Male", "Female", "Other"], "Required").required("Gender is Required."),
    dob: Yup.string().required("Dob is Required."),
    hobby:Yup.array().required("Hobby is Required.").min(2,"At list two hobby is require."),
    designation: Yup.string().required("Designation is Required."),
    phoneno: Yup.string().required("Phoneno is Required."),
    employeeSkill: Yup.array()
        .of(Yup.object().shape({ skillname: Yup.string().min(2, "At list one skill is require.").required("Skill is Required.") }))

});


const empHobby = ['Reading', 'Writing', 'Programming', 'Dancing']

const AddUpdateForm = (props: UpdateProps) => {

    const { empid, handleAfterSubmit, handleClose } = props
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
                        hobby: res.data.hobby.split(','),
                    }
                    console.log(data)
                    setInputs(data)
                })
        }
    }, [empid])

    // const [hobby, sethobby] = useState<string[]>([]);
    // const handleCheck = (event: SelectChangeEvent<typeof hobby>) => {
    //     const {
    //         target: { value },
    //     } = event;
    //     sethobby(
    //         typeof value === 'string' ? value.split(',') : value,
    //     );
    //     const data = value.toString();
    //      setInputs({ ...inputs, hobby: data })
    // };

    // useEffect(() => {
    //     if (empid != 0) {
    //         if (inputs) {
    //             sethobby(
    //                 typeof inputs.hobby === 'string' ? inputs.hobby.split(',') : inputs.hobby,
    //             );
    //         }
    //     }
    // }, [inputs])

    const createEmp = (data: IFormValues) => {
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

    const updateEmp = (data: IFormValues) => {
        if (empid) {
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


    const onFormSubmit = (employess: IFormValues) => {
        const emp = { ...employess }
        emp.hobby = [emp.hobby].join(',')
        return empid === 0 ? createEmp(emp) : updateEmp(emp)
    }

    return (
        <Formik
            initialValues={inputs}
            validationSchema={validationSchema}
            enableReinitialize
            onSubmit={(values) => {
                onFormSubmit(values);
            }}
        >
            {({ errors, touched, handleChange, values, isValid }) => {
              
                return (
                    <Form>
                        <Field as={TextField} fullWidth name="name" label='Name'
                            placeholder="Enter your name"
                            onChange={handleChange}
                            error={Boolean(errors.name) && Boolean(touched.name)}
                            helperText={Boolean(touched.name) && errors.name}
                        />
                        <br /><br />

                        <Field as={TextField} fullWidth name="email" label='Email'
                            placeholder="Enter your email"
                            onChange={handleChange}
                            error={Boolean(errors.email) && Boolean(touched.email)}
                            helperText={Boolean(touched.email) && errors.email}
                        />
                        <br /><br />

                        <FormControl>
                            <FormLabel id="demo-row-radio-buttons-group-label">Gender</FormLabel>
                            <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label"
                                name="row-radio-buttons-group"
                                value={values.gender}
                                onChange={handleChange}>
                                <FormControlLabel value="Female" name="gender" control={<Radio />} label="Female" />
                                <FormControlLabel value="Male" name="gender" control={<Radio />} label="Male" />
                                <FormControlLabel value="other" name="gender" control={<Radio />} label="Other" />
                            </RadioGroup>
                        </FormControl>
                        <FormHelperText sx={{ color: "red" }}>
                            {Boolean(touched.gender) && errors.gender}
                        </FormHelperText>
                        <br/>
                        <Field as={TextField} fullWidth name="dob" type="date"
                            onChange={handleChange}
                            error={Boolean(errors.dob) && Boolean(touched.dob)}
                            helperText={Boolean(touched.dob) && errors.dob}
                        />
                        <br /><br />
                       
                        <FormControl sx={{ m: 1, width: 545 }}>
                            <InputLabel id="demo-multiple-checkbox-label">Hobby</InputLabel>
                            <Select 
                                error={Boolean(errors.hobby) && Boolean(touched.hobby)}
                                labelId="demo-multiple-checkbox-label"
                                id="demo-multiple-checkbox"
                                multiple
                                value={values.hobby || []}
                                onChange={handleChange}
                                name="hobby"
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
                                        <Checkbox checked={values.hobby.indexOf(h) > -1} />
                                        <ListItemText primary={h} />
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormHelperText sx={{ color: "red" }}>
                            {Boolean(touched.hobby) && errors.hobby}
                        </FormHelperText>
                        <br /><br />

                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Designation</InputLabel>
                            <Select 
                                error={Boolean(errors.designation) && Boolean(touched.designation)}
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label="Designation"
                                name="designation"
                                value={values.designation}
                                onChange={handleChange}
                            >
                                <MenuItem value="Trainee">Trainee</MenuItem>
                                <MenuItem value="Jr.Developer">Jr.Developer</MenuItem>
                                <MenuItem value="Sr.Developer">Sr.Developer</MenuItem>
                            </Select>
                        </FormControl>
                        <FormHelperText sx={{ color: "red" }}>
                            {Boolean(touched.designation) && errors.designation}
                        </FormHelperText>
                        <br /><br />

                        <Field as={TextField} fullWidth name="phoneno" label='Phoneno'
                            placeholder="Enter your phoneno"
                            onChange={handleChange}
                            error={Boolean(errors.phoneno) && Boolean(touched.phoneno)}
                            helperText={Boolean(touched.phoneno) && errors.phoneno}
                        />
                        <br /><br />

                        <FieldArray name={'employeeSkill'}>
                            {arrayHelpers => (
                                <div>
                                    {values.employeeSkill && values.employeeSkill.length > 0 ? (
                                        values.employeeSkill.map((skill, index) => (
                                            <div key={index}>
                                                <Field as={TextField} sx={{ width: '70%' }} label='Skill'
                                                    name={`employeeSkill.${index}.skillname`}
                                                    placeholder="Enter your skill"
                                                    error={Boolean(errors.employeeSkill)&& Boolean(touched.employeeSkill)}
                                                />
                                                <Button style={{ margin: '15px', marginTop: '10px' }}
                                                    startIcon={<FontAwesomeIcon icon={faPlus} />}
                                                    variant='outlined'
                                                    type="button"
                                                    disabled={values.employeeSkill[index].skillname==""}
                                                    onClick={() => arrayHelpers.insert(index, '')} // insert an empty string at a position
                                                >
                                                </Button>

                                                <Button
                                                    startIcon={<FontAwesomeIcon icon={faMinus} />}
                                                    variant='outlined' color="error"
                                                    type="button"
                                                    disabled={values.employeeSkill[index].skillname==""}
                                                    onClick={() => arrayHelpers.remove(index)} // remove a skill from the list
                                                >
                                                </Button>
                                               
                                                {/* <div>
                                                   <ErrorMessage  name={`employeeSkill.${index}.skillname`}/>
                                                </div> */}
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
                        <br />

                        <Button type="submit" variant="contained"  >Save</Button>
                    </Form>
                )
            }}
        </Formik>
    )
}

export default AddUpdateForm