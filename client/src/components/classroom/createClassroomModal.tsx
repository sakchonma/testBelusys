import React, { useState, useEffect } from "react";

interface IClassroom {
    classroomid?: number;
    classname: string;
    academic_year: number;
    homeroom_teacher: string;
}

interface IDataInsert {
    gradelevelid: number;
    levelname: string;
}

interface ClassroomModalProps {
    classroom: IClassroom | null;
    onClose: () => void;
    onSave: (data: IClassroom) => void;
    dataInserts: IDataInsert[]; // รับข้อมูล levelname จากภายนอก
}

const ClassroomModal: React.FC<ClassroomModalProps> = ({ classroom, onClose, onSave, dataInserts }) => {
    const [selectedLevelname, setSelectedLevelname] = useState("");
    const [room, setRoom] = useState("");
    const [academicYear, setAcademicYear] = useState(new Date().getFullYear());
    const [homeroomTeacher, setHomeroomTeacher] = useState("");

    useEffect(() => {
        if (classroom?.classname) {
            const parts = classroom.classname.split("/");
            if (parts.length === 2) {
                setSelectedLevelname(parts[0]);
                setRoom(parts[1]);
            } else {
                setSelectedLevelname(classroom.classname);
                setRoom("");
            }
        } else {
            setSelectedLevelname("");
            setRoom("");
        }
        setAcademicYear(classroom?.academic_year || new Date().getFullYear());
        setHomeroomTeacher(classroom?.homeroom_teacher || "");
    }, [classroom]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedLevelname) {
            alert("Please select a level name");
            return;
        }
        if (!room.trim()) {
            alert("Please enter room");
            return;
        }
        if (!homeroomTeacher.trim()) {
            alert("Homeroom teacher is required");
            return;
        }

        const classname = `${selectedLevelname}/${room.trim()}`; // รวมกันเป็น classname

        onSave({
            classroomid: classroom?.classroomid,
            classname,
            academic_year: Number(academicYear),
            homeroom_teacher: homeroomTeacher.trim(),
        });
    };

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                backgroundColor: "rgba(0,0,0,0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 999,
            }}
        // ไม่มี onClick ปิด modal เวลากดข้างนอก
        >
            <div
                style={{
                    backgroundColor: "white",
                    padding: 20,
                    borderRadius: 8,
                    minWidth: 300,
                    position: "relative",
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* ปุ่ม Close ด้านบนขวา */}
                <button
                    onClick={onClose}
                    style={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        background: "transparent",
                        border: "none",
                        fontSize: 24,
                        cursor: "pointer",
                        lineHeight: 1,
                    }}
                    aria-label="Close modal"
                    title="Close"
                >
                    &times;
                </button>

                <h2>{classroom ? "Edit Classroom" : "Add Classroom"}</h2>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: 10 }}>
                        <label>
                            Level Name:<br />
                            <select
                                value={selectedLevelname}
                                onChange={(e) => setSelectedLevelname(e.target.value)}
                                style={{ width: "100%" }}
                            >
                                <option value="">-- Select Level --</option>
                                {dataInserts.map((d) => (
                                    <option key={d.gradelevelid} value={d.levelname}>
                                        {d.levelname}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>
                    <div style={{ marginBottom: 10 }}>
                        <label>
                            Room:<br />
                            <input
                                type="text"
                                value={room}
                                onChange={(e) => setRoom(e.target.value)}
                                style={{ width: "100%" }}
                                placeholder="Enter room (e.g. 1, 2, 3/1)"
                            />
                        </label>
                    </div>
                    <div style={{ marginBottom: 10 }}>
                        <label>
                            Academic Year:<br />
                            <input
                                type="number"
                                value={academicYear}
                                onChange={(e) => setAcademicYear(Number(e.target.value))}
                                style={{ width: "100%" }}
                                min={2000}
                                max={2100}
                            />
                        </label>
                    </div>
                    <div style={{ marginBottom: 10 }}>
                        <label>
                            Homeroom Teacher:<br />
                            <input
                                type="text"
                                value={homeroomTeacher}
                                onChange={(e) => setHomeroomTeacher(e.target.value)}
                                style={{ width: "100%" }}
                            />
                        </label>
                    </div>
                    <div style={{ textAlign: "right" }}>
                        <button type="button" onClick={onClose} style={{ marginRight: 10 }}>
                            Cancel
                        </button>
                        <button
                            type="submit"
                            style={{ backgroundColor: "#2563eb", color: "white", padding: "6px 12px" }}
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ClassroomModal;
