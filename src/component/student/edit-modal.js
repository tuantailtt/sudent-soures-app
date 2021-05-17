import React, { useEffect, useState} from 'react';
import axios from 'axios';
import { Modal, Input, Select,Form, InputNumber } from 'antd';
const { Option } = Select;

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

    function saveStudent(value){
        let studentDto = {
            "name": value.name === undefined ? null : value.name,
            "yearOld": value.yearOld === undefined ? null : value.yearOld,
            "sex": value.sex === undefined ? null : value.sex ==="0"? false:true,
            "passportNumber": value.passportNumber === undefined ? null: value.passportNumber,
            "phoneNumber": value.phoneNumber === undefined ? null : value.phoneNumber,
            "address": value.address === undefined ? null : value.address,
            "courses": student.courses.map(course => {
                return {"id":course.id}
            })
        }
        console.log(studentDto);
        axios.put('/api/students/'+student.id,studentDto)
            .then(function(response){
                console.log(response);
                handleClose();
                refreshTable();
            })
            .catch(function(error){
                alert(error);
            });
    }
    useEffect(() => {
        if(!show) {
            form.setFieldsValue({
                name: null,
                yearOld: 1,
                sex: "1",
                passportNumber: null,
                phoneNumber:null,
                address:null
            })
        }else{
            form.setFieldsValue({
                name: student.name,
                yearOld: student.yearOld,
                sex: student.sex,
                passportNumber: student.passportNumber,
                phoneNumber: student.phoneNumber,
                address: student.address
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
        >
            <Form {...layout} form={form} onFinish={saveStudent}>
                <Form.Item
                    name={'name'}
                    label="Name"
                    rules={[
                    {
                        min:2,
                        max:50,
                        required: true,
                    },]}
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