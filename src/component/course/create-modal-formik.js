import React from 'react';
import { useFormik} from 'formik';
import { Modal, Row, Col } from 'antd';



export const Basic = ({ show, handleClose, refreshTable }) => {

    const formik = useFormik({
        initialValues: { email: '', password: '' },
        validate: values => {
          const errors = {};
          if (!values.email) {
            errors.email = 'Required';
          } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
          ) {
            errors.email = 'Invalid email address';
          }
          return errors;
        },
        onSubmit: (values, { setSubmitting }) => {
          setTimeout(() => {
            alert(JSON.stringify(values, null, 2));
            setSubmitting(false);
          }, 400);
        }
    })

    return (
          
        <Modal
        visible={show}
        title="Edit course"
        okText= 'Create formik'
        onOk={formik.handleSubmit}
        onCancel={handleClose}
        width={1000}
        >
            <Row gutter={14}>
                <Col className="gutter-row" span={12}>
                    <label htmlFor="email">Email: </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.email}
                    />
                    {formik.errors.email ? <div>{formik.errors.email}</div> : null}
                </Col>
                <Col className="gutter-row" span={12}>
                    <label htmlFor="password">Password: </label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.password}
                    />
                </Col>
            </Row>
        </Modal>
    );
}

 