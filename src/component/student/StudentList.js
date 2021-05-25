import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, Input, Row, Col, Select, message,Pagination} from 'antd';
import { UserAddOutlined} from '@ant-design/icons';
import { CreateModal } from './create-modal';
import { EditModal } from './edit-modal';
import { RegisterModal } from './register-modal';

const { confirm } = Modal;
const { Option } = Select;

function StudentList() {

    const [data, setData] = useState([]);
    const [dataSource, setDataSource] = useState([]);
    const [columnSearch, setColumnSearch] = useState(["name"]);
    const [selectedStudent, setSelectedStudent] = useState({});
    const [isCreateModalShown, setIsCreateModalShown] = useState(false);
    const [isEditModalShown, setIsEditModalShown] = useState(false);
    const [isRegisterModalShown, setIsRegisterModalShown] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [valueSearch, setValueSearch] = useState('');
    const [totalElements,setTotalElements] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [sort, setSort] = useState(['id,descend'])

    const columns = [
        { title: 'Name', dataIndex: 'name',key: 'name', sorter: {multiple: 1,},width: '15%', }, 
        { title: 'Age', dataIndex: 'yearOld',key: 'yearOld',sorter: { multiple: 2,}, width: '5%', align:"center" },
        { title: 'Sex', dataIndex: 'sex', key: 'sex',sorter: { multiple: 3,}, width: '5%', align:"center"},
        { title: 'Address', dataIndex: 'address',key: 'address',sorter: { multiple: 4,}},
        { title: 'Passport number', dataIndex: 'passportNumber',key: 'passportNumber',sorter: { multiple: 5,}, width: '10%'},
        { title: 'Phone number',dataIndex: 'phoneNumber',key: 'phoneNumber',sorter: { multiple: 6,}, width: '10%'},
        {
            title: 'Action',dataIndex: '',key: 'x',align:"center", width: '20%',
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
                deleteStudent(student.id);
            },
            onCancel() {
            },
        });
    }

    
    function handleChangeSelectedAttributeSearch(params) {
        setColumnSearch(params);
        setRefresh(!refresh);
    }

    function handleChangeValueSearch(e){
        if (e.key === 'Enter') {
            setCurrentPage(1);
            setRefresh(!refresh);
        }
        
        
    }
    function handleChangeAndSetValueSearch(e){
        setValueSearch(e.target.value);
        if(e.target.value === ""){
            setCurrentPage(1);
            setRefresh(!refresh);
        }
    }
    function pageSizeChange(current, pageSize) {
        setPageSize(pageSize);
        setRefresh(!refresh);
    }
    function currentPageChange(current, pageSize){
        setCurrentPage(current)
        setRefresh(!refresh);
    }



    function refreshTable(){
        setCurrentPage(1);
        setRefresh(!refresh);
    }

    function onChange(pagination, filters, sorter, extra) {
        let sortArr =[];
        if( Array.isArray(sorter)){
            sortArr = sorter.map(e => e.field+","+e.order)
            setSort(sortArr);
        }else if(sorter.order === undefined){
            setSort(["id,descend"]);
        }else{
            sortArr =[sorter.field+","+sorter.order]
                setSort(sortArr);
        }
        setRefresh(!refresh);
    }
    
    useEffect(() => {
        let params = new URLSearchParams();
        params.append("pageNo",currentPage-1);
        params.append("pageSize",pageSize);
        params.append("searchValue",valueSearch);
        sort.forEach(e =>{
            params.append("sort",e);
        })
        columnSearch.forEach(e => {
            params.append("columnSearch",e);
        })
        let request = {
            params: params
        };
        axios.get('/api/studentsPage', request)
            .then(function (response) {
                setTotalElements(response.data.totalElements);
                setPageSize(response.data.size);
                setCurrentPage(response.data.number);
                let list = response.data.studentDtoList.map(row => ({
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
                setData(list);
                setDataSource(list);
            })
        // eslint-disable-next-line
        }, [refresh]);
    
  return (
        <div className="App">
        <div>
            <CreateModal show={isCreateModalShown} handleClose={handleCreateModalClose} refreshTable={refreshTable}/>
            <EditModal show={isEditModalShown} handleClose={handleEditModalClose} student={selectedStudent} refreshTable={refreshTable}/>
            <RegisterModal show={isRegisterModalShown} handleClose={handleRegisterModalClose} student={selectedStudent} refreshTable={refreshTable}/>
            <Row gutter={16}>
                <Col className="gutter-row" span={4}></Col>
                <Col className="gutter-row" span={2} style={{marginTop: "4px"}}>Search keywords:</Col>
                <Col className="gutter-row" span={4}>
                    <Input
                        placeholder="Enter search keywords"
                        onKeyDown={(e)=>handleChangeValueSearch(e)}
                        onChange={handleChangeAndSetValueSearch}
                    />
                </Col>
                <Col className="gutter-row" span={2} style={{marginTop: "4px"}}>
                    Search attribute:  
                </Col>
                <Col className="gutter-row" span={6}>
                <Select
                    mode="multiple"
                    allowClear
                    style={{ width: '100%' }}
                    placeholder="Please select search attribute"
                    defaultValue={columnSearch}
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
                    <Button type="primary" onClick={showCreateModal}><UserAddOutlined />Create</Button>
                </Col>
            </Row>
            <br></br>
            <Table dataSource={dataSource} 
                columns={columns} 
                pagination={{ 
                    hideOnSinglePage: true
                }}
                size="small"
                onChange={onChange}
            />
            <br></br>
            <Pagination
                    showSizeChanger
                    pageSizeOptions= {[8, 10, 12]}
                    onShowSizeChange={pageSizeChange}
                    current={currentPage}
                    pageSize= {pageSize}
                    total={totalElements}
                    onChange={currentPageChange}
                />
        </div>
    </div>
  );
}


export default StudentList;