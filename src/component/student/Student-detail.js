import React,{useState, useEffect} from 'react';
import axios from 'axios';
import {useParams,Link} from "react-router-dom";
import {Breadcrumb, Card,Row, Col ,Collapse,Tag,Button,Table,message ,Modal} from 'antd';
const { Panel } = Collapse;
const { confirm } = Modal;

function StudentDetail(){
    const [student,setStudent]=useState({});
    const [account, setAccount]= useState({});
    const [refresh, setRefresh]=useState(false);

    let { id } = useParams();
    const courseRegistedtColums = [
      { title: 'Name', dataIndex: '',key: 'name', width: '20%',
        render: (course) =>(
          <Link to={`/admin/student/${student.id}/course/${course.id}`}>{course.name}</Link>
        )
      },
      { title: 'Description', dataIndex: 'description',key: 'description'},
      { title: 'Cost', dataIndex: 'cost',key: 'cost', width: '10%'},
      {
          title: 'Payment',dataIndex: '',key: 'x',align:"center", width: '15%',
          render: (course) => course.paid === true ? 
            <Button disabled style={{backgroundColor:"green",color:"white"}}>Paid</Button> : 
            <Button type="primary" onClick={()=>showPaymentConfirm(student.id,course.id)}>Pay</Button>
              
      }
  ];

  async function showPaymentConfirm(studentId,courseId){
    confirm({
      title: 'Are you sure pay this course?',
      content: "",
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        // payment(studentId,courseId);
        return new Promise(async (resolve, reject) => {
          await payment(studentId,courseId);
          setTimeout(reject , 0);
        }).catch(() => {});
      },
      onCancel() {
      },
  });
  }

 async function payment (studenId, courseId) {
   await axios.get('/api/students/'+studenId+'/payment/'+courseId)
      .then(function(response){
        let msg = response.data.split(":");
        if(msg[0]==="success"){
          message.success(msg[1]);
          setRefresh(!refresh);
        }else{
          message.error(msg[1]);
        };
      })
  }


    useEffect(()=>{
      axios.get('/api/students/'+id)
        .then(function(response){
          setStudent(response.data);
        })
      axios.get('/api/accounts/student/'+id)
        .then(function(response){
          setAccount(response.data);
        })
    },[id,refresh])
    return (
        <div>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>Admin</Breadcrumb.Item>
        <Breadcrumb.Item>Student</Breadcrumb.Item>
        <Breadcrumb.Item>{id}</Breadcrumb.Item>
      </Breadcrumb>
      <Card title={student.name+' ( Account: '+account.name+', Balance: '+account.balance+' )'}>
      <Collapse defaultActiveKey={['1','2']} >
        <Panel header="Personal information" key="1">
          <Row>
            <Col span={4} style={{borderRight:"1px solid",marginRight:"5px"}}><label><Tag color="magenta">Name:</Tag> {student.name}</label></Col>
            <Col span={2} style={{borderRight:"1px solid",marginRight:"5px"}}><label><Tag color="magenta">Age:</Tag> {student.yearOld}</label></Col>
            <Col span={2} style={{borderRight:"1px solid",marginRight:"5px"}}><label><Tag color="magenta">Sex:</Tag> {student.sex === null ? "": student.sex === 0 ? "Female":"Male"}</label></Col>
            <Col span={4} style={{borderRight:"1px solid",marginRight:"5px"}}><label><Tag color="magenta">Passport Number:</Tag> {student.passportNumber}</label></Col>
            <Col span={4} style={{borderRight:"1px solid",marginRight:"5px"}}><label><Tag color="magenta">Phone Number:</Tag> {student.phoneNumber}</label></Col>
            <Col span={7} style={{borderRight:"1px solid",marginRight:"5px"}}><label><Tag color="magenta">Address:</Tag> {student.address}</label></Col>
          </Row>
        </Panel>
        <Panel header="Course registed" key="2">
          <Table 
            dataSource={Object.values(student).length !== 0 ? student.courses.map(row => ({
              key: row.id,
              id: row.id,
              name: row.name,
              description: row.description,
              cost: row.cost,
              paid: row.paid
            })) : []} 
            columns={courseRegistedtColums} 
            pagination={{ position: ["bottomCenter"] ,pageSize: 4,size:"default",}}
            scroll={{ y: 400}}
          />
        </Panel>
        
      </Collapse>,
      </Card>
    </div>
    )
}
export default StudentDetail;