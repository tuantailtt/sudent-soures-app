import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, Input, Row, Col, Select, message} from 'antd';
import { CreateModal } from './create-modal';
import { EditModal } from './edit-modal';
import { RegisterModal } from './register-modal';

const { confirm } = Modal;
const { Option } = Select;

function StudentList() {

    const [data, setData] = useState([]);
    const [dataSource, setDataSource] = useState([]);
    const [valueSearch, setValueSearch] = useState('');
    const [attributeSearch, setAttributeSearch] = useState(['name']);
    const [selectedStudent, setSelectedStudent] = useState({});
    const [isCreateModalShown, setIsCreateModalShown] = useState(false);
    const [isEditModalShown, setIsEditModalShown] = useState(false);
    const [isRegisterModalShown, setIsRegisterModalShown] = useState(false);
    const [refresh, setRefresh] = useState(false);

    const columns = [
        { title: 'Name', dataIndex: 'name',key: 'name',sorter: (a, b) => a.name.length - b.name.length}, 
        { title: 'Age', dataIndex: 'yearOld',key: 'yearOld',sorter: (a, b) => a.yearOld - b.yearOld},
        { title: 'Sex', dataIndex: 'sex', key: 'sex',sorter: (a, b) => a.sex.length - b.sex.length},
        { title: 'Address', dataIndex: 'address',key: 'address'},
        { title: 'Passport number', dataIndex: 'passportNumber',key: 'passportNumber'},
        { title: 'Phone number',dataIndex: 'phoneNumber',key: 'phoneNumber'},
        {
            title: 'Action',dataIndex: '',key: 'x',align:"center",
            render: (student) => (
                <div>
                    <Button type="primary" onClick={() => showEditModal(student)}  style={{margin:"0px 2px 0px 2px"}}>Edit</Button>
                    <Button type="default" onClick={() => showRegisterModal(student)} style={{margin:"0px 2px 0px 2px"}}>Courses</Button>
                    <Button type="danger" onClick={() => showDeleteConfirm(student)}  style={{margin:"0px 2px 0px 2px"}}>Delete</Button>
                </div>)
        }
    ];

    const handleCreateModalClose = () => {
        setIsCreateModalShown(false);
    };
    const showCreateModal = () => {
        setIsCreateModalShown(true);
    }
    
    const handleEditModalClose = () => {
        setIsEditModalShown(false);
    };
    const showEditModal = (student) => {
        setSelectedStudent(student)
        setIsEditModalShown(true);
    }
    const handleRegisterModalClose = () => {
        setIsRegisterModalShown(false);
    };
    const showRegisterModal = (student) => {
        setSelectedStudent(student)
        setIsRegisterModalShown(true);
    }

    function deleteStudent(id){
        axios.delete('/api/students/'+id)
            .then(function(response){
                setData(data.filter(item => item.key !== id));
                setDataSource(dataSource.filter(item => item.key !== id))
                message.success('Delete successful');
            }).catch(function(error){
                message.error('Delete successful');
            })
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
        if(currValue !== ""){
            setValueSearch(currValue);
            filterDataSource(currValue,attributeSearch);
        }else{
            setDataSource(data);
        }
        
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

    function refreshTable(){
        setRefresh(!refresh);
    }
    
    useEffect(() => {
        axios.get('/api/students')
            .then(function (response) {
                let list = response.data.map(row => ({
                    key: row.id,
                    id: row.id,
                    name: row.name,
                    yearOld: row.yearOld,
                    sex: row.sex===true?"Male":row.sex===false?"Female":"",
                    passportNumber: row.passportNumber,
                    phoneNumber: row.phoneNumber,
                    address: row.address,
                    courses: row.courses
                }));
                console.log('list',list)
                setData(list);
                setDataSource(list);
            })
        }, [refresh]);
        
    
  return (
        <div className="App">
        <div>
            <CreateModal show={isCreateModalShown} handleClose={handleCreateModalClose} refreshTable={refreshTable}/>
            <EditModal show={isEditModalShown} handleClose={handleEditModalClose} student={selectedStudent} refreshTable={refreshTable}/>
            <RegisterModal show={isRegisterModalShown} handleClose={handleRegisterModalClose} student={selectedStudent} refreshTable={refreshTable}/>
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
                <Col className="gutter-row" span={5}>
                   
                </Col>
                <Col className="gutter-row" span={7}>
                    <Button type="primary" onClick={showCreateModal}>Create</Button>
                </Col>
            </Row>
            <Table dataSource={dataSource} 
                columns={columns} 
                pagination={{ position: ["bottomCenter"] ,pageSize: 8 }}
            />
        </div>
    </div>
  );
}


export default StudentList;