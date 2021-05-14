import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, Input, Row, Col, Select,Form } from 'antd';

const { confirm } = Modal;
const { Option } = Select;

function CourseList(){

    const [data, setData] = useState([]);
    const [dataSource, setDataSource] = useState([]);
    const [valueSearch, setValueSearch] = useState('');
    const [attributeSearch, setAttributeSearch] = useState(['name']);
    const [visibleModal, setVisibleModal] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [form] = Form.useForm();

    const columns = [
        { title: 'Name', dataIndex: 'name',key: 'name'},
        { title: 'Description', dataIndex: 'description',key: 'description'},
        {
            title: 'Action',dataIndex: '',key: 'x',align:"center",
            render: (course,record) => (
                <div>
                    <Button type="primary" onClick={() => showDetail(record.key)}>Detail</Button>
                    <Button type="danger" onClick={() => showDeleteConfirm(course)}>Delete</Button>
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

    function deleteCourse(id){
        axios.delete('/api/courses/'+id)
            .then(function(response){
                setData(data.filter(item => item.key !== id));
                setDataSource(dataSource.filter(item => item.key !== id))
            })
    }
    
    function showDeleteConfirm(course) {
        confirm({
            title: 'Are you sure delete this Course?',
            content: course.name,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                console.log(course.id);
                deleteCourse(course.id);
            },
            onCancel() {
            console.log('Cancel');
            },
        });
    }

    function showDetail(key){
        console.log(key);
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

    function showModal(){
        setVisibleModal(true);
    }

    function createCourse(value){
        console.log(value);
        let courseDto = {
            "name": value.name === undefined ? null : value.name,
            "description": value.description === undefined ? null : value.description,
        }
        axios.post('/api/courses/',courseDto)
            .then(function(response){
                console.log(response);
                setRefresh(!refresh);
                setVisibleModal(false);
            }).catch(function(error){
                alert("Create course: failed");
                console.log(error);
            })
    }



    useEffect(() => {
        axios.get('/api/courses')
            .then(function (response) {
                console.log(response.data)
                let list = response.data.map(row => ({
                    key: row.id,
                    id: row.id,
                    name: row.name,
                    description: row.description
                }));
                setData(list);
                setDataSource(list);
            })
    }, [refresh]);

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
                        <Option value="description">Description</Option>
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
                            <Form {...layout} form={form} onFinish={createCourse}>
                                <Form.Item
                                    name={'name'}
                                    label="Name"
                                    rules={[
                                    {
                                        min:2,
                                        required: true,
                                    },]}
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    name={'description'}
                                    label="Description"
                                    
                                >
                                    <Input />
                                </Form.Item>
                            </Form>
                        </Modal>
                    </Col>
                </Row>
            </div>
           <div>
                <Table dataSource={dataSource} 
                columns={columns} 
                pagination={{ position: ["bottomCenter"] }}
                />
            </div>
        </div>
      );
}


export default CourseList;