import React, { useEffect} from 'react';
import axios from 'axios';
import { Modal, Input, Select,Form, InputNumber,message } from 'antd';
const { Option } = Select;
const { confirm } = Modal;


export const EditModal = ({ show, handleClose, student, refreshTable }) => {

    const [form] = Form.useForm();
    const layout = {
        labelCol: {
          span: 7,
        },
        wrapperCol: {
          span: 17,
        },
    };
    function showSaveConfirm(value){
        confirm({
            title: 'Are you sure save this your changed ?',
            content: "",
            okText: 'Yes',
            okType: 'primary',
            cancelText: 'No',
            onOk() {
                updateStudent(value);
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    };

    function updateStudent(value){
        console.log('value',value);
        let studentDto = {
            "name": value.name === undefined ? null : value.name,
            "yearOld": value.yearOld === undefined ? null : value.yearOld,
            "sex": value.sex === undefined ? null : value.sex ==="Female"? false:true,
            "passportNumber": value.passportNumber === undefined || value.passportNumber === "" ? null: value.passportNumber,
            "phoneNumber": value.phoneNumber === undefined || value.phoneNumber === "" ? null : value.phoneNumber,
            "address": value.address === undefined || value.phoneNumber === ""? null : value.address,
            "courses": student.courses.map(course => {
                return {"id":course.id}
            })
        }
        console.log(studentDto);
        axios.put('/api/students/'+student.id,studentDto)
            .then(function(response){
                console.log(response);
                handleClose();
                message.success('Update successful');
                refreshTable();
            })
            .catch(function(error){
                message.error('Create failed');
            });
    }
    useEffect(() => {
        if(Object.values(student).length !== 0 || show===true) {
            form.setFieldsValue({
                name: student.name,
                yearOld: student.yearOld,
                sex: student.sex,
                passportNumber: student.passportNumber,
                phoneNumber: student.phoneNumber,
                address: student.address
            })
        }else{
            form.setFieldsValue({
                name: null,
                yearOld: 1,
                sex: "1",
                passportNumber: null,
                phoneNumber:null,
                address:null
            })
        }
    }, [student,show])

    

    return (
        <Modal
            visible={show}
            title="Edit student"
            okText= 'Save'
            onOk={form.submit}
            onCancel={handleClose}
            forceRender={true}
            
        >
            <Form {...layout} form={form} onFinish={showSaveConfirm}>
                <Form.Item
                    name={'name'}
                    label="Name"
                    rules={[
                        {
                            min:2,
                            max:50,
                            message: "Name must be between 2 and 50 characters",
                            
                        },
                        {
                            required: true,
                            message: "Name is not required"
                        }
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name={'yearOld'}
                    label="Age"
                    rules={[
                    {
                        type: 'number',
                        min: 1,
                        max: 150,
                        message: "Age must be between 1 and 150"
                    },]}
                >
                        <InputNumber />
                </Form.Item>
                <Form.Item 
                    name={'sex'}
                    label="Sex"
                >
                        <Select >
                            <Option value="Female">Female</Option>
                            <Option value="Male">Male</Option>
                        </Select>
                </Form.Item>
                <Form.Item
                    name={'passportNumber'}
                    label="Passport Number"
                    rules={[
                        {
                            min: 5,
                            max: 20,
                            message: "Passport number must be between 5 and 20 characters"
                        },]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name={'phoneNumber'}
                    label="Phone Number"
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name={'address'}
                    label="Address"
                >
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    )
}