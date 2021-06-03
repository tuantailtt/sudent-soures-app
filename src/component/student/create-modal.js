import React from 'react';
import axios from 'axios';
import { Modal, Row,Col, message } from 'antd';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
const { confirm } = Modal;


export const CreateModal = ({ show, handleClose, refreshTable }) => {
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
            },
        });
    };

    function createStudent(value){
        let studentDto = {
            "name": value.name === "" ? null : value.name,
            "yearOld": value.yearOld === "" ? null : value.yearOld,
            "sex": value.sex === "" ? null : value.sexC === "Female"? false:true,
            "passportNumber": value.passportNumber === "" ? null: value.passportNumber,
            "phoneNumber": value.phoneNumber === "" ? null : value.phoneNumber,
            "address": value.address === "" ? null : value.addressC,
        }
        axios.post('/api/students/',studentDto)
            .then(function(response){
                handleClose();
                message.success('Create successful');
                refreshTable();
            })
            .catch(function(error){
                message.error('Create failed');
            });
    }

    return (
        <Formik
            enableReinitialize
            initialValues={{ name: "", yearOld: 1, sex:"Male",address:'',passportNumber:'',phoneNumber:'' }}
            validationSchema={Yup.object({
                name: Yup.string()
                    .min(2, 'Name must be between 2 and 50 characters')
                    .max(50, 'Name must be between 2 and 50 characters')
                    .required('Required'),
                yearOld: Yup.number()
                    .min(1, 'Age must be between 1 and 150')
                    .max(150, 'Age must be between 1 and 150'),
                address: Yup.string()
                    .max(254, 'Address must have at most 254 characters'),
                passportNumber: Yup.string()
                    .matches(/^[0-9]+$/, "Must be only digits")
                    .min(5,'Passport number should be between 5 and 15 characters')
                    .max(15,'Passport number should be between 5 and 15 characters'),
                phoneNumber: Yup.string()
                    .matches(/^[0-9]+$/, "Must be only digits")
                    .min(5,'Phone number should be between 5 and 15 characters')
                    .max(15,'Phone number should be between 5 and 15 characters'),
            })}
            onSubmit={(values, { setSubmitting,resetForm}) => {
                setTimeout(() => {
                showCreateConfirm(values);
                setSubmitting(false);
                resetForm({
                    values:{ name: "", yearOld: 1, sex:"Male",address:'',passportNumber:'',phoneNumber:'' }
                })
                }, 0);
            }}
        >
            {formik => (
                <Modal
                    visible={show}
                    title="Create new student"
                    okText= 'Create'
                    onOk={formik.handleSubmit}
                    onCancel={handleClose}
                    forceRender={true}
                >
                    <Form >
                        <Row className="ant-form-item">
                            <Col span={6} className="ant-form-item-label"><label htmlFor="name" className="ant-form-item-required">Name </label></Col>
                            <Col span={16}>
                                <Field name="name" type="text" className="ant-input"/>
                                <ErrorMessage name="name" component="div" className="ant-form-item-explain ant-form-item-explain-error"/>
                            </Col>
                        </Row>
                        <Row className="ant-form-item">
                            <Col span={6} className ="ant-form-item-label"><label htmlFor="yearOld" >Age </label></Col>
                            <Col span={7} >
                                <Field name="yearOld" type="number" className="ant-input"/>
                                <ErrorMessage name="yearOld" component="div" className="ant-form-item-explain ant-form-item-explain-error" />
                            </Col>
                            <Col span={3} className="ant-form-item-label"><label htmlFor="sex">Sex </label></Col>
                            <Col span={6}>
                                <Field name="sex" as="select" className="ant-input" >
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </Field>
                            </Col>
                        </Row>
                        <Row className="ant-form-item">
                            <Col span={6} className ="ant-form-item-label"><label htmlFor="address">Address </label></Col>
                            <Col span={16}>
                                <Field name="address" type="text" className="ant-input" />
                                <ErrorMessage name="address" component="div" className="ant-form-item-explain ant-form-item-explain-error"/>
                            </Col>
                        </Row>
                        <Row className="ant-form-item">
                            <Col span={6} className ="ant-form-item-label"><label htmlFor="passportNumber">Passport number </label></Col>
                            <Col span={16}>
                                <Field name="passportNumber" type="text" className="ant-input" />
                                <ErrorMessage name="passportNumber" component="div" className="ant-form-item-explain ant-form-item-explain-error"/>
                            </Col>
                        </Row>
                        <Row className="ant-form-item">
                            <Col span={6} className ="ant-form-item-label"><label htmlFor="phoneNumber">Phone number </label></Col>
                            <Col span={16}>
                                <Field name="phoneNumber" type="text" className="ant-input" />
                                <ErrorMessage name="phoneNumber" component="div" className="ant-form-item-explain ant-form-item-explain-error"/>
                            </Col>
                        </Row>
                    </Form>
                </Modal>
            )}
        </Formik>
    )
}