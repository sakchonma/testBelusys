SELECT 
    s.studentid,
    s.firstname,
    s.lastname,
    s.birthdate,
    TIMESTAMPDIFF(YEAR, s.birthdate, CURDATE()) AS age,
    c.classname
FROM student s
JOIN student_classroom sc ON s.studentid = sc.studentid
JOIN classroom c ON sc.classroomid = c.classroomid
WHERE 
    s.genderid = 1
    AND TIMESTAMPDIFF(YEAR, s.birthdate, CURDATE()) BETWEEN 10 AND 12;