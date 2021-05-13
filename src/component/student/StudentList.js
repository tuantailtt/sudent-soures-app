import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, Input, Row, Col, Select,Form, InputNumber } from 'antd';

const { confirm } = Modal;
const { Option } = Select;

function StudentList() {

    const [data, setData] = useState([]);
    const [dataSource, setDataSource] = useState([]);
    const [valueSearch, setValueSearch] = useState('');
    const [attributeSearch, setAttributeSearch] = useState(['name']);
    const [visibleModal, setVisibleModal] = useState(false);
    const [form] = Form.useForm();

    const columns = [
        { title: 'Name', dataIndex: 'name',key: 'name'},
        { title: 'Age', dataIndex: 'yearOld',key: 'yearOld'},
        { title: 'Sex', dataIndex: 'sex', key: 'sex'},
        { title: 'Address', dataIndex: 'address',key: 'address'},
        { title: 'Passport number', dataIndex: 'passportNumber',key: 'passportNumber'},
        { title: 'Phone number',dataIndex: 'phoneNumber',key: 'phoneNumber'},
        {
            title: 'Action',dataIndex: '',key: 'x',align:"center",
            render: (student,record) => (
                <div>
                    <Button type="primary" onClick={() => showDetail(record.key)}>Detail</Button>
                    <Button type="danger" onClick={() => showDeleteConfirm(student)}>Delete</Button>
                </div>)
        }
    ];
    const layout = {
        labelCol: {
          span: 7,
        },
        wrapperCol: {
          span: 17,
        },
      };

    function showModal(){
        setVisibleModal(true);
    }

    function deleteStudent(id){
        axios.delete('/api/students/'+id)
            .then(function(response){
                console.log(response);
                let list = dataSource.filter(item => item.key !== id);
                console.log(list);
                setData(list);
                setDataSource(list)
            });
    }

    function createStudent(value){
        console.log(value);
        let studentDto = {
            "name": value.name === undefined ? null : value.name,
            "yearOld": value.yearOld === undefined ? null : value.yearOld,
            "sex": value.sex === undefined ? null : +value.sex,
            "passportNumber": value.passportNumber === undefined ? null: value.passportNumber,
            "phoneNumber": value.phoneNumber === undefined ? null : value.phoneNumber,
            "address": value.address === undefined ? null : value.address,
        }
        axios.post('/api/students/',studentDto)
            .then(function(response){
                console.log(response);
               
            });
    }
    
    function showDeleteConfirm(student) {
        confirm({
            title: 'Are you sure delete this student?',
            content: student.name,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                console.log(student.id);
                deleteStudent(student.id);
            },
            onCancel() {
            console.log('Cancel');
            },
        });
    }

    function showDetail(key){
        console.log(key);
    }
    
    function handleChangeSelectedAttributeSearch(params) {
        if(params[0]==null){
            setValueSearch('');
            setAttributeSearch([]);
            setDataSource(data);
        }else{
            setAttributeSearch(params);
            console.log('value',params);
            filterDataSource(valueSearch,params);
        }
    }

    function handleChangeValueSearch(e){
        console.log('param',attributeSearch);
        const currValue = e.target.value;
        setValueSearch(currValue);
        filterDataSource(currValue,attributeSearch);
    }

    function filterDataSource(value,params){
        const filteredData = data.filter((entry) =>{
            let isNotNull = false ;
            params.forEach(param => {
                if(entry[param] != null){
                    if(entry[param].toString().toLowerCase().includes(value.toLowerCase())){isNotNull = true;};
                }
            });
            return isNotNull === true;
        });
        setDataSource(filteredData);
    }
    
    useEffect(() => {
        axios.get('/api/students')
            .then(function (response) {
                console.log(response.data)
                let list = response.data.map(row => ({
                    key: row.id,
                    id: row.id,
                    name: row.name,
                    yearOld: row.yearOld,
                    sex: row.sex===true?"F":"M",
                    passportNumber: row.passportNumber,
                    phoneNumber: row.phoneNumber,
                    address: row.address
                }));
                setData(list);
                setDataSource(list);
            })
        }, []);
    
  return (
        <div className="App">
        <div>
            
            <Row gutter={16}>
                <Col className="gutter-row" span={6}>
                    <Input
                        placeholder="Enter search keywords"
                        value={valueSearch}
                        onChange={(e)=>handleChangeValueSearch(e)}
                    />
                </Col>
                <Col className="gutter-row" span={6}>
                <Select
                    mode="multiple"
                    allowClear
                    style={{ width: '100%' }}
                    placeholder="Please select the desired attribute"
                    defaultValue={['name']}
                    onChange={handleChangeSelectedAttributeSearch}
                >
                   <Option value="name">Name</Option>
                   <Option value="yearOld">Age</Option>
                   <Option value="sex">Sex</Option>
                   <Option value="address">Address</Option>
                   <Option value="passportNumber">Passport Number</Option>
                   <Option value="phoneNumber">Phone Number</Option>
                </Select>
                </Col>
                <Col className="gutter-row" span={6}>
                    <div >col-6</div>
                </Col>
                <Col className="gutter-row" span={6}>
                    <Button onClick={showModal}>Create</Button>
                    <Modal
                        visible={visibleModal}
                        title="Create new student"
                        okText= 'Create'
                        onOk={form.submit}
                        onCancel={()=>{setVisibleModal(false);form.resetFields()}}
                    >
                        <Form {...layout} form={form} onFinish={createStudent}>
                            {/* Any input */}
                            <Form.Item
                                name={'name'}
                                label="Name"
                                rules={[
                                {
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
                                    min: 0,
                                    max: 150,
                                },]}
                            >
                                 <InputNumber />
                            </Form.Item>
                            <Form.Item 
                                name={'sex'}
                                label="Sex"
                            >
                                 <Select 
                                    options={[
                                        { label: 'Female', value: '0' },
                                        { label: 'Male', value: '1' }
                                    ]} 
                                    />
                            </Form.Item>
                            <Form.Item
                                name={'passportNumber'}
                                label="Passport Number"
                                rules={[
                                {
                                    required: true,
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
                </Col>
            </Row>
            <Table dataSource={dataSource} 
                columns={columns} 
                pagination={{ position: ["bottomCenter"] }}
            />
        </div>
    </div>
  );
}


export default StudentList;