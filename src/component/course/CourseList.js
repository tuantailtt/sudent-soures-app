import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, Input, Row, Col, message ,Pagination, Space} from 'antd';
import { FolderAddOutlined} from '@ant-design/icons';
import { CreateModal } from './create-modal';
import { EditModal } from './edit-modal';
import { SearchOutlined } from '@ant-design/icons';



const { confirm } = Modal;

function CourseList(){

    const [data, setData] = useState([]);
    const [dataSource, setDataSource] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState({});
    const [isCreateModalShown, setIsCreateModalShown] = useState(false);
    const [isEditModalShown, setIsEditModalShown] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [totalElements,setTotalElements] = useState(0);
    const [pageSize, setPageSize] = useState(8);
    const [currentPage, setCurrentPage] = useState(1);
    const [sorting, setSorting] = useState(["id:descend"])
    const [nameSearch,setNameSearch]=useState('');
    const [descriptionSearch,setDescriptionSearch]=useState('');

    const columns = [
        { title: 'Name', dataIndex: 'name',key: 'name',sorter: {multiple: 1,}, width: '30%',
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div style={{ padding: 8 }}>
                <Input
                    placeholder={`Search name`}
                    value={selectedKeys[0]}
                    onChange={e => {setSelectedKeys(e.target.value ? [e.target.value] : [])}}
                    onPressEnter={() => handleNameSearch(selectedKeys,confirm)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                    type="primary"
                    onClick={() => handleNameSearch(selectedKeys, confirm)}
                    icon={<SearchOutlined />}
                    size="small"
                    style={{ width: 90 }}
                    >
                    Search
                    </Button>
                    <Button onClick={() => handleNameSearchReset(clearFilters)} size="small" style={{ width: 90 }}>
                    Reset
                    </Button>
                </Space>
                </div>
            ),
            filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        },
            
        { title: 'Description', dataIndex: 'description',key: 'description',sorter: {multiple: 1,}, width: '50%',
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div style={{ padding: 8 }}>
                <Input
                    placeholder={`Search name`}
                    value={selectedKeys[0]}
                    onChange={e => {setSelectedKeys(e.target.value ? [e.target.value] : [])}}
                    onPressEnter={() => handleDescriptionSearch(selectedKeys,confirm)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                    type="primary"
                    onClick={() => handleDescriptionSearch(selectedKeys, confirm)}
                    icon={<SearchOutlined />}
                    size="small"
                    style={{ width: 90 }}
                    >
                    Search
                    </Button>
                    <Button onClick={() => handleDescriptionSearchReset(clearFilters)} size="small" style={{ width: 90 }}>
                    Reset
                    </Button>
                </Space>
                </div>
            ),
            filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        },
        {
            title: 'Action',dataIndex: '',key: 'x',align:"center", width: '20%',
            render: (course) => (
                <div>
                    <Button type="primary" onClick={() => showEditModal(course)} style={{margin:"0px 2px 0px 2px"}}>Edit</Button>
                    <Button type="danger" onClick={() => showDeleteConfirm(course)} style={{margin:"0px 2px 0px 2px"}}>Delete</Button>
                </div>)
        }
    ];

    const handleNameSearch = (selectedKeys, confirm) => {
        confirm();
        setNameSearch(selectedKeys[0] === undefined?"":selectedKeys[0]);
        setRefresh(!refresh)
    };
    const handleNameSearchReset = clearFilters => {
        clearFilters();
        setNameSearch("");
        setRefresh(!refresh)
    };
    const handleDescriptionSearch = (selectedKeys, confirm) => {
        confirm();
        setDescriptionSearch(selectedKeys[0] === undefined?"":selectedKeys[0]);
        setRefresh(!refresh)
    };
    const handleDescriptionSearchReset = clearFilters => {
        clearFilters();
        setDescriptionSearch("");
        setRefresh(!refresh)
    };
    
    const handleCreateModalClose = () => {
        setIsCreateModalShown(false);
    };
    const showCreateModal = () => {
        setIsCreateModalShown(true);
    }
    
    const handleEditModalClose = () => {
        setIsEditModalShown(false);
    };
    const showEditModal = (course) => {
        setSelectedCourse(course)
        setIsEditModalShown(true);
    }

    function deleteCourse(id){
        axios.delete('/api/courses/'+id)
            .then(function(response){
                setData(data.filter(item => item.key !== id));
                setDataSource(dataSource.filter(item => item.key !== id))
                message.success('Delete successful');
            }).catch(function(error){
                message.error('Delete failed');
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
                deleteCourse(course.id);
            },
            onCancel() {
            },
        });
    }

    function refreshTable(){
        setCurrentPage(1);
        setRefresh(!refresh);
    }
    function pageSizeChange(current, pageSize) {
        setPageSize(pageSize);
        setRefresh(!refresh);
    }
    function currentPageChange(current, pageSize){
        setCurrentPage(current)
        setRefresh(!refresh);
    }

    function onChange(pagination, filters, sorter, extra) {
        let sortArr =[];
        if( Array.isArray(sorter)){
            sortArr = sorter.map(e => e.field+":"+e.order)
            setSorting(sortArr);
        }else if(sorter.order === undefined){
            setSorting(["id,descend"]);
        }else{
            sortArr =[sorter.field+":"+sorter.order]
                setSorting(sortArr);
        }
        setRefresh(!refresh);
    }

    useEffect(() => {
        let params = new URLSearchParams();
        params.append("searching","name:"+nameSearch);
        params.append("searching","description:"+descriptionSearch);
        params.append("pageNo",currentPage-1);
        params.append("pageSize",pageSize);
        sorting.forEach(e => {
            params.append("sorting",e);
        });
        
        let request = {
            params: params
        };
        axios.get('/api/coursesPage',request).then(function (response) {
                setTotalElements(response.data.totalElements);
                setPageSize(response.data.size);
                setCurrentPage(response.data.number);
                let list = response.data.courseDtoList.map(row => ({
                    key: row.id,
                    id: row.id,
                    name: row.name,
                    description: row.description,
                    students: row.students
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
             <EditModal show={isEditModalShown} handleClose={handleEditModalClose} course={selectedCourse} refreshTable={refreshTable}/>
                <Row gutter={16}>
                    <Col className="gutter-row" span={18}></Col>
                    
                    <Col className="gutter-row" span={6}>
                        <Button onClick={showCreateModal} type="primary"><FolderAddOutlined />Create</Button>
                    </Col>
                </Row>
            </div>
            <br></br>
           <div>
                <Table 
                    dataSource={dataSource} 
                    columns={columns} 
                    size="small"
                    pagination={{ 
                        hideOnSinglePage: true
                    }}
                    onChange={onChange}
                />
                <br />
                <Pagination
                    showSizeChanger
                    pageSizeOptions= {[6,8,10]}
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


export default CourseList;