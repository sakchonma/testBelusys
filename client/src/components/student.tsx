// StudentPage.tsx
import React, { useEffect, useState } from "react";

interface Student {
  studentid: number;
  prefixid?: number;
  firstname: string;
  lastname: string;
  genderid: number;
  birthdate: string;
  gradelevelid: number;
}

const StudentPage = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState({ studentid: "", name: "", gradelevelid: "" });
  const [page, setPage] = useState(1);
  const limit = 10;

  // Fetch students from API
  const fetchStudents = async () => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      studentid: search.studentid,
      name: search.name,
      gradelevelid: search.gradelevelid,
    });

    const res = await fetch(`http://localhost:3000/api/student/list?${params.toString()}`);
    const json = await res.json();
    if (json.status) {
      console.log(json.data)
      setStudents(json.data || []);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [page]);

  // Handle search submit
  const handleSearch = () => {
    setPage(1);
    // fetchStudents();
  };

  // Simple Delete (confirm + call API)
  // const handleDelete = async (studentid: number) => {
  //   if (!window.confirm("Delete this student?")) return;
  //   const res = await fetch(`http://localhost:3000/api/student/delete/${studentid}`, { method: "DELETE" });
  //   const json = await res.json();
  //   if (json.status) {
  //     alert("Deleted successfully");
  //     fetchStudents();
  //   } else {
  //     alert("Delete failed");
  //   }
  // };

  return (
    <div style={{ padding: 20 }}>
      <h1>Student Management</h1>

      <div style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Student ID"
          value={search.studentid}
          onChange={e => setSearch({ ...search, studentid: e.target.value })}
          style={{ marginRight: 10 }}
        />
        <input
          type="text"
          placeholder="Name"
          value={search.name}
          onChange={e => setSearch({ ...search, name: e.target.value })}
          style={{ marginRight: 10 }}
        />
        <input
          type="text"
          placeholder="Grade Level"
          value={search.gradelevelid}
          onChange={e => setSearch({ ...search, gradelevelid: e.target.value })}
          style={{ marginRight: 10 }}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <table border={1} cellPadding={5} cellSpacing={0} style={{ width: "100%", textAlign: "left" }}>
        <thead>
          <tr>
            <th>StudentID</th>
            <th>Prefix</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Gender</th>
            <th>Birthdate</th>
            <th>Grade Level</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.length === 0 && (
            <tr>
              <td colSpan={8} style={{ textAlign: "center" }}>No data found</td>
            </tr>
          )}
          {students.map(s => (
            <tr key={s.studentid}>
              <td>{s.studentid}</td>
              <td>{s.prefixid}</td>
              <td>{s.firstname}</td>
              <td>{s.lastname}</td>
              <td>{s.genderid}</td>
              <td>{new Date(s.birthdate).toLocaleDateString()}</td>
              <td>{s.gradelevelid}</td>
              <td>
                <button onClick={() => alert("Edit not implemented")}>Edit</button>{" "}
                {/* <button onClick={() => handleDelete(s.studentid)}>Delete</button> */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: 20 }}>
        <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
          Prev
        </button>{" "}
        <button onClick={() => setPage(p => p + 1)}>Next</button>
      </div>
    </div>
  );
};

export default StudentPage;
