import React, { useEffect, useState } from "react";
import ClassroomModal from "../components/classroom/createClassroomModal";
import ManageStudentsModal from "../components/classroom/ManageStudentsModal";

interface IClassroom {
    classroomid?: number;
    classname: string;
    academic_year: number;
    homeroom_teacher: string;
}
interface IDataInsert {
    gradelevelid: number;
    levelname: string
}
const ClassroomPage = () => {
    const [classrooms, setClassrooms] = useState<IClassroom[]>([]);
    const [dataInserts, setDataInserts] = useState<IDataInsert[]>([]);

    const [searchClassname, setSearchClassname] = useState("");
    const [searchRoomid, setSearchRoomid] = useState("");
    const [searchTeacherName, setSearchTeacherName] = useState("");

    const [page, setPage] = useState(1);
    const limit = 10;

    const [modalOpen, setModalOpen] = useState(false);
    const [editingClassroom, setEditingClassroom] = useState<IClassroom | null>(null);

    const [manageStudentsOpen, setManageStudentsOpen] = useState(false);
    const [selectedClassroom, setSelectedClassroom] = useState<IClassroom | null>(null);

    const fetchClassrooms = async () => {
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
                name: searchClassname,              // ชื่อห้องเรียน
                roomid: searchRoomid,         // ปีการศึกษา (หรือ ถ้า API เป็นอย่างอื่น ปรับตามนั้น)
                teacherName: searchTeacherName,     // ชื่อครูประจำชั้น
            });
            const res = await fetch(`http://localhost:3000/api/classroom/list?${params.toString()}`);
            const json = await res.json();

            if (json.status) {
                setClassrooms(json.data || []);
            } else {
                setClassrooms([]);
                alert("Failed to load classrooms");
            }
        } catch (error) {
            console.error(error);
            alert("Error fetching data");
        }
    };
    const getDetail = async () => {
        const res = await fetch(`http://localhost:3000/api/student/datainsert`);
        const json = await res.json();
        if (json.status) {
            setDataInserts(json.data.gradelevels || []);
        }
    };

    useEffect(() => {
        fetchClassrooms();
        getDetail();
    }, [page, searchClassname, searchRoomid, searchTeacherName]);

    const openCreateModal = () => {
        setEditingClassroom(null);
        setModalOpen(true);
    };

    const openEditModal = (c: IClassroom) => {
        setEditingClassroom(c);
        setModalOpen(true);
    };

    const openManageStudents = (c: IClassroom) => {
        setSelectedClassroom(c);
        setManageStudentsOpen(true);
    };
    const closeManageStudents = () => {
        setSelectedClassroom(null);
        setManageStudentsOpen(false);
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Delete this classroom?")) return;
        try {
            const res = await fetch(`http://localhost:3000/api/classroom/delete/${id}`, {
                method: "DELETE",
            });
            const json = await res.json();
            if (json.status) {
                alert(json.message || "Deleted successfully");
                fetchClassrooms();
            } else {
                alert(json.message || "Delete failed");
            }
        } catch (error) {
            console.error(error);
            alert("Error deleting classroom");
        }
    };

    const handleSave = async (data: IClassroom) => {
        try {
            const isEdit = !!data.classroomid;
            const url = isEdit
                ? `http://localhost:3000/api/classroom/update`
                : `http://localhost:3000/api/classroom/create`;
            const method = isEdit ? "PUT" : "POST";
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ data }),
            });
            const json = await res.json();
            if (json.status) {
                alert(isEdit ? "Updated successfully" : "Created successfully");
                setModalOpen(false);
                fetchClassrooms();
            } else {
                alert(json.message);
            }
        } catch (error) {
            console.error(error);
            alert("Error saving classroom");
        }
    };

    return (
        <div style={{ padding: 20 }}>
            <h1>Classroom Management</h1>

            <div style={{ marginBottom: 20, display: "flex", gap: 10 }}>
                <input
                    type="text"
                    placeholder="Search by Classroom ID"
                    value={searchRoomid}
                    onChange={(e) => {
                        setPage(1);
                        setSearchRoomid(e.target.value);
                    }}
                />
                <input
                    type="text"
                    placeholder="Search by Class Name"
                    value={searchClassname}
                    onChange={(e) => {
                        setPage(1);
                        setSearchClassname(e.target.value);
                    }}
                />

                <input
                    type="text"
                    placeholder="Search by Teacher Name"
                    value={searchTeacherName}
                    onChange={(e) => {
                        setPage(1);
                        setSearchTeacherName(e.target.value);
                    }}
                />
                <button
                    onClick={openCreateModal}
                    style={{ backgroundColor: "#2563eb", color: "white", padding: "8px 16px", borderRadius: 6 }}
                >
                    Add Classroom
                </button>
            </div>

            <table border={1} cellPadding={5} cellSpacing={0} style={{ width: "100%", textAlign: "left" }}>
                <thead>
                    <tr>
                        <th>Classroom ID</th>
                        <th>Class Name</th>
                        <th>Academic Year</th>
                        <th>Homeroom Teacher</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {classrooms.length === 0 ? (
                        <tr>
                            <td colSpan={5} style={{ textAlign: "center" }}>
                                No classrooms found
                            </td>
                        </tr>
                    ) : (
                        classrooms.map((c) => (
                            <tr key={c.classroomid}>
                                <td>{c.classroomid}</td>
                                <td>{c.classname}</td>
                                <td>{c.academic_year}</td>
                                <td>{c.homeroom_teacher}</td>
                                <td>
                                    <button onClick={() => openEditModal(c)}>Edit</button>{" "}
                                    <button onClick={() => handleDelete(c.classroomid!)}>Delete</button>{" "}
                                    <button onClick={() => openManageStudents(c)}>Manage Students</button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            <div style={{ marginTop: 20 }}>
                <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                    Prev
                </button>{" "}
                <button onClick={() => setPage((p) => p + 1)}>Next</button>
            </div>

            {modalOpen && (
                <ClassroomModal
                    classroom={editingClassroom}
                    onClose={() => setModalOpen(false)}
                    onSave={handleSave}
                    dataInserts={dataInserts}
                />

            )}

            {manageStudentsOpen && selectedClassroom && (
                <ManageStudentsModal
                    classroomid={selectedClassroom.classroomid!}
                    classname={selectedClassroom.classname}
                    levelname={selectedClassroom.classname.split("/")[0]}  // ✅ เพิ่มบรรทัดนี้
                    onClose={closeManageStudents}
                    onUpdate={() => {
                        fetchClassrooms();
                    }}
                />
            )}

        </div>
    );
};

export default ClassroomPage;
