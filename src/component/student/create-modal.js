import React, { useEffect} from 'react';
import axios from 'axios';
import { Modal, Input, Select, Form, InputNumber, message } from 'antd';
const { Option } = Select;
const { confirm } = Modal;


export const CreateModal = ({ show, handleClose, refreshTable }) => {

    const [form] = Form.useForm();
    const layout = {
        labelCol: {
          span: 7,
        },
        wrapperCol: {
          span: 17,
        },
    };
    function showCreateConfirm(value){
        confirm({
            title: 'Are you sure create new Student ?',
            content: "",
            okText: 'Yes',
            okType: 'primary',
            cancelText: 'No',
            onOk() {
                createStudent(value);
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    };

    function createStudent(value){
        let studentDto = {
            "name": value.nameCreate === undefined ? null : value.nameCreate,
            "yearOld": value.yearOldCreate === undefined ? null : value.yearOldCreate,
            "sex": value.sexCreate === undefined ? null : value.sexCreate === "Female"? false:true,
            "passportNumber": value.passportNumberCreate === undefined ? null: value.passportNumberCreate,
            "phoneNumber": value.phoneNumberCreate === undefined ? null : value.phoneNumberCreate,
            "address": value.addressCreate === undefined ? null : value.addressCreate,
        }
        axios.post('/api/students/',studentDto)
            .then(function(response){
                console.log(response);
                handleClose();
                message.success('Create successful');
                refreshTable();
            })
            .catch(function(error){
                message.error('Create failed');
            });
    }
    useEffect(() => {
        if(!show) {
            form.setFieldsValue({
                nameCreate: null,
                yearOldCreate: 1,
                sexCreate: "Male",
                passportNumberCreate: null,
                phoneNumberCreate:null,
                addressCreate:null
            })
        }
    }, [show])

    

    return (
        <Modal
            visible={show}
            title="Create new student"
            okText= 'Create'
            onOk={form.submit}
            onCancel={handleClose}
            forceRender={true}

        >
            <Form {...layout} form={form} onFinish={showCreateConfirm}>
                <Form.Item
                    name={'nameCreate'}
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
                    name={'yearOldCreate'}
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
                    name={'sexCreate'}
                    label="Sex"
                >
                        <Select >
                            <Option value="Female">Female</Option>
                            <Option value="Male">Male</Option>
                        </Select>
                </Form.Item>
                <Form.Item
                    name={'passportNumberCreate'}
                    label="Passport Number"
                    rules={[
                        {
                            min: 5,
                            max: 20,
                            message: "Passport number must be between 5 and 20 characters",
                        },]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name={'phoneNumberCreate'}
                    label="Phone Number"
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name={'addressCreate'}
                    label="Address"
                >
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    )
}