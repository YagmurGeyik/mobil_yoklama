import React from "react";

const dummyStudents = [
  { id: 1, name: "Ayşe Yılmaz", present: true },
  { id: 2, name: "Mehmet Demir", present: false },
  { id: 3, name: "Zeynep Koç", present: true },
];

const StudentList = () => {
  return (
    <div className="student-list">
      <h3>Öğrenci Katılım Listesi</h3>
      <ul>
        {dummyStudents.map((student) => (
          <li key={student.id}>
            {student.name} - {student.present ? "Katıldı" : "Yok"}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StudentList;