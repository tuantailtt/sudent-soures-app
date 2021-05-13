import './App.css';
import 'antd/dist/antd.css';
import StudentList from './component/student/StudentList';
// import CourseList from './component/course/CourseList';

function App() {
  return (
    <div className="App">
       <StudentList />
       <hr></hr>
       {/* <CourseList /> */}
    </div>
  );
}

export default App;
