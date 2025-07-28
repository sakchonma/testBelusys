import React, { useEffect, useState } from "react";
import StudentModal from "../components/students/CreateStudentModal";

interface IStudent {
  studentid: number;
  prefixid?: number;
  firstname: string;
  lastname: string;
  genderid: number;
  birthdate: string;
  gradelevelid: number;
  levelname: string;
  prefixname: string;
  gendername: string;
}

interface IDataInsert {
  genders?: Array<any>;
  rooms?: Array<any>;
  gradelevels: Array<{ gradelevelid: number; levelname: string }>;
  prefixs?: Array<any>;
}

const StudentPage = () => {
  const [students, setStudents] = useState<IStudent[]>([]);
  const [dataInserts, setDataInserts] = useState<IDataInsert>({
    genders: [],
    rooms: [],
    gradelevels: [],
    prefixs: [],
  });

  const [search, setSearch] = useState({ studentid: "", name: "", gradelevelid: "" });
  const [page, setPage] = useState(1);
  const limit = 10;

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editStudent, setEditStudent] = useState<IStudent | null>(null);

  const listStudents = async () => {
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
      setStudents(json.data || []);
    }
  };

  const getDetail = async () => {
    const res = await fetch(`http://localhost:3000/api/student/datainsert`);
    const json = await res.json();
    if (json.status) {
      setDataInserts(json.data || []);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      listStudents();
      getDetail();
    }, 200);
    return () => clearTimeout(timeout);
  }, [search, page]);

  const handleDelete = async (studentid: number) => {
    if (!window.confirm("Delete this student?")) return;
    const res = await fetch(`http://localhost:3000/api/student/delete/${studentid}`, { method: "DELETE" });
    const json = await res.json();
    if (json.status) {
      alert("Deleted successfully");
      listStudents();
    } else {
      alert(json.message || "Delete failed");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Student Management</h1>

      <div style={{ marginBottom: 20, display: "flex", gap: 10 }}>
        <input
          type="text"
          placeholder="Student ID"
          value={search.studentid}
          onChange={(e) => setSearch({ ...search, studentid: e.target.value })}
          style={{ marginRight: 10 }}
        />
        <input
          type="text"
          placeholder="Name"
          value={search.name}
          onChange={(e) => setSearch({ ...search, name: e.target.value })}
          style={{ marginRight: 10 }}
        />
        <select
          value={search.gradelevelid}
          onChange={(e) => setSearch({ ...search, gradelevelid: e.target.value })}
          style={{ marginRight: 10 }}
        >
          <option value="">All Grade Levels</option>
          {dataInserts.gradelevels.map((g) => (
            <option key={g.gradelevelid} value={g.gradelevelid}>
              {g.levelname}
            </option>
          ))}
        </select>
        <button
          onClick={() => {
            setModalMode("create");
            setModalOpen(true);
            setEditStudent(null);
          }}
          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
        >
          Create Student
        </button>
      </div>
      <div style={{ marginBottom: 20 }}>

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
              <td colSpan={8} style={{ textAlign: "center" }}>
                No data found
              </td>
            </tr>
          )}
          {students.map((s) => (
            <tr key={s.studentid}>
              <td>{s.studentid}</td>
              <td>{s.prefixname}</td>
              <td>{s.firstname}</td>
              <td>{s.lastname}</td>
              <td>{s.gendername}</td>
              <td>{new Date(s.birthdate).toLocaleDateString()}</td>
              <td>{s.levelname}</td>
              <td>
                <button
                  onClick={() => {
                    setModalMode("edit");
                    setEditStudent(s);
                    setModalOpen(true);
                  }}
                >
                  Edit
                </button>
                <button onClick={() => handleDelete(s.studentid)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: 20 }}>
        <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
          Prev
        </button>{" "}
        <button onClick={() => setPage((p) => p + 1)}>Next</button>
      </div>

      {/* Modal */}
      <StudentModal
        mode={modalMode}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => {
          getDetail();
          listStudents();
        }}
        prefixs={dataInserts.prefixs || []}
        genders={dataInserts.genders || []}
        gradelevels={dataInserts.gradelevels}
        student={editStudent || undefined}
      />
    </div>
  );
};

export default StudentPage;
