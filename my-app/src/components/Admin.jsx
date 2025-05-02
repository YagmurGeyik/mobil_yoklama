import React from "react";

const dummyStudents = [
  { id: 1, name: "Öğenci1", present: true },
  { id: 2, name: "Öğenci1", present: false },
  { id: 3, name: "Öğenci1", present: true },
];

const Admin = () => {
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

export default Admin;