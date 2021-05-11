import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Button, Table } from 'antd';

const StudentList = () => {
    const [data, setData] = useState([]);
    
    function deleteStudent(e) {
       console.log(e);
      }

    const columns = [
        { title: 'Name', dataIndex: 'name',key: 'name'},
        { title: 'Age', dataIndex: 'yearOld',key: 'yearOld'},
        { title: 'Sex', dataIndex: 'sex', key: 'sex'},
        { title: 'Address', dataIndex: 'address',key: 'address'},
        { title: 'Passport number', dataIndex: 'passportNumber',key: 'passportNumber'},
        { title: 'Phone number',dataIndex: 'phoneNumber',key: 'phoneNumber'},
        {
            title: 'Action',dataIndex: '',key: '',
            render: (e) => (
                <div>
                    <Button type="primary" onClick={() => deleteStudent(e)}>Detail</Button>
                    <Button type="danger" onClick={() => deleteStudent(e)}>Delete</Button>
                </div>)
        }
    ];
    
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
        })
    }, []);
    
  return (
    <div className="App">
       <div>
            {console.log('datastate',data)}
            <Table dataSource={data} 
            columns={columns} 
            />
        </div>
    </div>
  );
}

export default StudentList;