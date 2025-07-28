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
    width: 400,
    boxShadow: "0 0 20px rgba(0,0,0,0.5)",
};

const inputStyle: React.CSSProperties = {
    backgroundColor: "#444",
    color: "#fff",
    border: "1px solid #666",
    padding: 8,
    borderRadius: 6,
    marginTop: 5,
    marginBottom: 15,
    width: "100%",
};

const submitButtonStyle: React.CSSProperties = {
    backgroundColor: "#007bff",
    color: "#fff",
    padding: "10px 20px",
    border: "none",
    borderRadius: 6,
    marginRight: 10,
    cursor: "pointer",
};

const cancelButtonStyle: React.CSSProperties = {
    backgroundColor: "#6c757d",
    color: "#fff",
    padding: "10px 20px",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
};

interface Student {
    studentid?: number;
    prefixid?: number;
    firstname: string;
    lastname: string;
    genderid: number;
    birthdate: string;
    gradelevelid: number;
}

interface StudentModalProps {
    mode: "create" | "edit";
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    prefixs: Array<{ prefixid: number; prefixname: string }>;
    genders: Array<{ genderid: number; gendername: string }>;
    gradelevels: Array<{ gradelevelid: number; levelname: string }>;
    student?: Student; // สำหรับ edit mode
}

const StudentModal: React.FC<StudentModalProps> = ({
    mode,
    isOpen,
    onClose,
    onSuccess,
    prefixs,
    genders,
    gradelevels,
    student,
}) => {
    const [form, setForm] = useState<Student>({
        prefixid: prefixs[0]?.prefixid || 1,
        firstname: "",
        lastname: "",
        genderid: genders[0]?.genderid || 1,
        birthdate: "",
        gradelevelid: gradelevels[0]?.gradelevelid || 1,
    });

    useEffect(() => {
        if (mode === "edit" && student) {
            setForm(student);
        } else if (mode === "create") {
            setForm({
                prefixid: prefixs[0]?.prefixid || 1,
                firstname: "",
                lastname: "",
                genderid: genders[0]?.genderid || 1,
                birthdate: "",
                gradelevelid: gradelevels[0]?.gradelevelid || 1,
            });
        }
    }, [mode, student, prefixs, genders, gradelevels]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: name === "birthdate" ? value : isNaN(Number(value)) ? value : Number(value),
        }));
    };

    const handleSubmit = async () => {
        try {
            const url =
                mode === "create"
                    ? "http://localhost:3000/api/student/create"
                    : "http://localhost:3000/api/student/update";

            const method = mode === "create" ? "POST" : "PUT";

            const payload = mode === "create" ? { data: form } : { data: { ...form, studentid: student?.studentid } };

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const json = await res.json();
            if (json.status) {
                alert(mode === "create" ? "Student created successfully!" : "Student updated successfully!");
                onSuccess();
                onClose();
            } else {
                alert(json.message);
            }
        } catch (err) {
            alert("Error: " + err);
        }
    };

    if (!isOpen) return null;

    return (
        <div style={overlayStyle}>
            <div style={modalStyle}>
                <h2 style={{ marginBottom: 20 }}>{mode === "create" ? "Create Student" : "Edit Student"}</h2>

                <div>
                    <label>Prefix:</label>
                    <select name="prefixid" value={form.prefixid} onChange={handleChange} style={inputStyle}>
                        {prefixs.map((p) => (
                            <option key={p.prefixid} value={p.prefixid}>
                                {p.prefixname}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label>First Name:</label>
                    <input name="firstname" value={form.firstname} onChange={handleChange} style={inputStyle} />
                </div>

                <div>
                    <label>Last Name:</label>
                    <input name="lastname" value={form.lastname} onChange={handleChange} style={inputStyle} />
                </div>

                <div>
                    <label>Gender:</label>
                    <select name="genderid" value={form.genderid} onChange={handleChange} style={inputStyle}>
                        {genders.map((g) => (
                            <option key={g.genderid} value={g.genderid}>
                                {g.gendername}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label>Birthdate:</label>
                    <input type="date" name="birthdate" value={form.birthdate} onChange={handleChange} style={inputStyle} />
                </div>

                <div>
                    <label>Grade Level:</label>
                    <select name="gradelevelid" value={form.gradelevelid} onChange={handleChange} style={inputStyle}>
                        {gradelevels.map((g) => (
                            <option key={g.gradelevelid} value={g.gradelevelid}>
                                {g.levelname}
                            </option>
                        ))}
                    </select>
                </div>

                <div style={{ marginTop: 20 }}>
                    <button onClick={handleSubmit} style={submitButtonStyle}>
                        {mode === "create" ? "Create" : "Update"}
                    </button>
                    <button onClick={onClose} style={cancelButtonStyle}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StudentModal;
