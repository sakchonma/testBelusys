import React, { useEffect, useState } from "react";

const overlayStyle: React.CSSProperties = {
    position: "fixed",
    top: 0, left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
};

const modalStyle: React.CSSProperties = {
    backgroundColor: "#2c2c2c",
    color: "#fff",
    padding: 24,
    borderRadius: 12,
    width: 700,
    maxHeight: "90vh",
    overflowY: "auto",
};

const buttonStyle: React.CSSProperties = {
    padding: "6px 12px",
    borderRadius: 6,
    border: "none",
    cursor: "pointer",
};

interface Student {
    studentid: number;
    prefixname: string;
    firstname: string;
    lastname: string;
    levelname: string;
}

interface ManageStudentsModalProps {
    classroomid: number;
    classname: string;
    levelname: string; // รับ levelname สำหรับกรอง API
    onClose: () => void;
    onUpdate: () => void;
}

const ManageStudentsModal: React.FC<ManageStudentsModalProps> = ({
    classroomid,
    classname,
    levelname,
    onClose,
    onUpdate,
}) => {
    const [studentsInRoom, setStudentsInRoom] = useState<Student[]>([]);
    const [studentsWithoutRoom, setStudentsWithoutRoom] = useState<Student[]>([]);
    const [searchName, setSearchName] = useState("");
    const [page, setPage] = useState(1);
    const limit = 5;

    const fetchStudentsInRoom = async () => {
        try {
            const res = await fetch(`http://localhost:3000/api/classroom/studentinroom/${classroomid}`);
            const json = await res.json();
            if (json.status) {
                setStudentsInRoom(json.data);
            } else {
                setStudentsInRoom([]);
                alert("Failed to load students in room");
            }
        } catch (error) {
            console.error(error);
            alert("Error loading students in room");
        }
    };

    const fetchStudentsWithoutRoom = async () => {
        try {
            const params = new URLSearchParams({
                name: searchName,
                page: page.toString(),
                limit: limit.toString(),
                gradelevel: levelname,
            });
            const res = await fetch(`http://localhost:3000/api/classroom/studentwithout?${params.toString()}`);
            const json = await res.json();
            if (json.status) {
                setStudentsWithoutRoom(json.data);
            } else {
                setStudentsWithoutRoom([]);
                alert("Failed to load students without room");
            }
        } catch (error) {
            console.error(error);
            alert("Error loading students without room");
        }
    };

    useEffect(() => {
        fetchStudentsInRoom();
    }, [classroomid]);

    useEffect(() => {
        fetchStudentsWithoutRoom();
    }, [searchName, page, levelname]);

    const handleAddStudent = async (studentid: number) => {
        try {
            const res = await fetch(`http://localhost:3000/api/classroom/add`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ data: { classroomid, studentid } }),
            });
            const json = await res.json();
            if (json.status) {
                alert("Added student successfully");
                fetchStudentsInRoom();
                fetchStudentsWithoutRoom();
                onUpdate();
            } else {
                alert("Failed to add student");
            }
        } catch (error) {
            alert("Error adding student: " + error);
        }
    };

    const handleRemoveStudent = async (studentid: number) => {
        if (!window.confirm("Remove this student from classroom?")) return;
        try {
            const res = await fetch(`http://localhost:3000/api/classroom/remove`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ data: { classroomid, studentid } }),
            });
            const json = await res.json();
            if (json.status) {
                alert("Removed student successfully");
                fetchStudentsInRoom();
                fetchStudentsWithoutRoom();
                onUpdate();
            } else {
                alert("Failed to remove student");
            }
        } catch (error) {
            alert("Error removing student: " + error);
        }
    };

    return (
        <div style={overlayStyle}>
            <div style={modalStyle}>
                <h2>
                    Manage Students for Classroom: {classname} (ID: {classroomid})
                </h2>

                <button
                    onClick={onClose}
                    style={{ ...buttonStyle, backgroundColor: "#6c757d", color: "#fff", float: "right" }}
                >
                    Close
                </button>

                <h3>Students in this Classroom</h3>
                {studentsInRoom.length === 0 ? (
                    <p>No students in this classroom.</p>
                ) : (
                    <table
                        width="100%"
                        style={{
                            marginBottom: 20,
                            borderCollapse: "collapse",
                            border: "1px solid #ccc",
                        }}
                    >
                        <thead>
                            <tr>
                                <th style={{ border: "1px solid #ccc", padding: "8px" }}>StudentID</th>
                                <th style={{ border: "1px solid #ccc", padding: "8px" }}>Name</th>
                                <th style={{ border: "1px solid #ccc", padding: "8px" }}>Level</th>
                                <th style={{ border: "1px solid #ccc", padding: "8px" }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {studentsInRoom.map((s) => (
                                <tr key={s.studentid}>
                                    <td style={{ border: "1px solid #ccc", padding: "8px" }}>{s.studentid}</td>
                                    <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                                        {`${s.prefixname} ${s.firstname} ${s.lastname}`}
                                    </td>
                                    <td style={{ border: "1px solid #ccc", padding: "8px" }}>{s.levelname}</td>
                                    <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                                        <button
                                            style={{ ...buttonStyle, backgroundColor: "#dc3545", color: "white" }}
                                            onClick={() => handleRemoveStudent(s.studentid)}
                                        >
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                <h3>Add Student to Classroom</h3>
                <input
                    type="text"
                    placeholder="Search student by name"
                    value={searchName}
                    onChange={(e) => {
                        setPage(1);
                        setSearchName(e.target.value);
                    }}
                    style={{
                        width: "100%",
                        padding: "8px",
                        marginBottom: 10,
                        borderRadius: 6,
                        border: "1px solid #666",
                    }}
                />

                {studentsWithoutRoom.length === 0 ? (
                    <p>No students found to add.</p>
                ) : (
                    <table
                        width="100%"
                        style={{
                            borderCollapse: "collapse",
                            border: "1px solid #ccc",
                        }}
                    >
                        <thead>
                            <tr>
                                <th style={{ border: "1px solid #ccc", padding: "8px" }}>StudentID</th>
                                <th style={{ border: "1px solid #ccc", padding: "8px" }}>Name</th>
                                <th style={{ border: "1px solid #ccc", padding: "8px" }}>Level</th>
                                <th style={{ border: "1px solid #ccc", padding: "8px" }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {studentsWithoutRoom.map((s) => (
                                <tr key={s.studentid}>
                                    <td style={{ border: "1px solid #ccc", padding: "8px" }}>{s.studentid}</td>
                                    <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                                        {`${s.prefixname} ${s.firstname} ${s.lastname}`}
                                    </td>
                                    <td style={{ border: "1px solid #ccc", padding: "8px" }}>{s.levelname}</td>
                                    <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                                        <button
                                            style={{ ...buttonStyle, backgroundColor: "#28a745", color: "white" }}
                                            onClick={() => handleAddStudent(s.studentid)}
                                        >
                                            Add
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                <div style={{ marginTop: 10, textAlign: "center" }}>
                    <button
                        disabled={page <= 1}
                        onClick={() => setPage((p) => p - 1)}
                        style={{ ...buttonStyle, marginRight: 10 }}
                    >
                        Prev
                    </button>
                    <button
                        disabled={studentsWithoutRoom.length < limit}
                        onClick={() => setPage((p) => p + 1)}
                        style={buttonStyle}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ManageStudentsModal;
