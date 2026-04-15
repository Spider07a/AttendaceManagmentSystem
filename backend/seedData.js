const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');
const Subject = require('./models/Subject');
const Attendance = require('./models/Attendance');

const generateStudents = (dept, count, prefix) => {
    const students = [];
    for(let i=1; i<=count; i++) {
        const id = i < 10 ? `00${i}` : `0${i}`;
        students.push({
            name: `${prefix} Student ${i}`,
            email: `student${i}_${dept.toLowerCase()}@gmail.com`,
            rollNo: `${dept.toUpperCase()}-${id}`
        });
    }
    // Hardcode anurag to CSE
    if (dept === 'CSE') {
        students[0].name = 'Anurag Daksh';
        students[0].email = 'anurag@gmail.com';
    }
    if (dept === 'EE') {
        students[0].name = 'Rahul Electrical';
        students[0].email = 'rahul_ee@gmail.com';
    }
    return students;
}

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/attendance_db');
    console.log('MongoDB Connected for Massive Universe Seeding...');

    await User.deleteMany({});
    await Subject.deleteMany({});
    await Attendance.collection.drop().catch(e => {});

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('password', salt); // Default everywhere

    // 1. GLOBAL ADMIN
    await User.create({ name: 'System Admin', email: 'admin@gmail.com', password, role: 'admin' });

    console.log('Building Massive Departments...');
    
    // --- DEPARTMENT 1: COMPUTER SCIENCE (CSE) ---
    const hodCSE = await User.create({ name: 'HOD Computer Science', email: 'hod_cse@gmail.com', password, role: 'hod', department: 'CSE' });
    const facCSE1 = await User.create({ name: 'Dr. Ramesh', email: 'ramesh@gmail.com', password, role: 'faculty', department: 'CSE' });
    const facCSE2 = await User.create({ name: 'Prof. Geeta', email: 'geeta@gmail.com', password, role: 'faculty', department: 'CSE' });
    
    const cseSubs = [
        await Subject.create({ name: 'Data Structures', code: 'CS-DSA', department: 'CSE', semester: 3, facultyId: facCSE1._id }),
        await Subject.create({ name: 'Operating Systems', code: 'CS-OS', department: 'CSE', semester: 3, facultyId: facCSE2._id }),
        await Subject.create({ name: 'Database Systems', code: 'CS-DBMS', department: 'CSE', semester: 3, facultyId: facCSE1._id }),
        await Subject.create({ name: 'Computer Networks', code: 'CS-CN', department: 'CSE', semester: 3, facultyId: facCSE2._id })
    ];
    
    const cseStudents = generateStudents('CSE', 12, 'Tech');

    // --- DEPARTMENT 2: ELECTRICAL ENGINEERING (EE) ---
    const hodEE = await User.create({ name: 'HOD Electrical', email: 'hod_ee@gmail.com', password, role: 'hod', department: 'EE' });
    const facEE1 = await User.create({ name: 'Dr. Verma', email: 'verma@gmail.com', password, role: 'faculty', department: 'EE' });
    
    const eeSubs = [
        await Subject.create({ name: 'Circuit Theory', code: 'EE-CIR', department: 'EE', semester: 3, facultyId: facEE1._id }),
        await Subject.create({ name: 'Digital Logic', code: 'EE-DL', department: 'EE', semester: 3, facultyId: facEE1._id }),
        await Subject.create({ name: 'Signals & Systems', code: 'EE-SIG', department: 'EE', semester: 3, facultyId: facEE1._id }),
        await Subject.create({ name: 'Control Systems', code: 'EE-CTRL', department: 'EE', semester: 3, facultyId: facEE1._id })
    ];
    
    const eeStudents = generateStudents('EE', 10, 'Volt');

    // --- DEPARTMENT 3: MECHANICAL ENGINEERING (ME) ---
    const hodME = await User.create({ name: 'HOD Mechanical', email: 'hod_me@gmail.com', password, role: 'hod', department: 'ME' });
    const facME1 = await User.create({ name: 'Dr. Sharma', email: 'sharma@gmail.com', password, role: 'faculty', department: 'ME' });
    
    const meSubs = [
        await Subject.create({ name: 'Thermodynamics', code: 'ME-THM', department: 'ME', semester: 3, facultyId: facME1._id }),
        await Subject.create({ name: 'Fluid Mechanics', code: 'ME-FM', department: 'ME', semester: 3, facultyId: facME1._id }),
        await Subject.create({ name: 'Kinetics', code: 'ME-KIN', department: 'ME', semester: 3, facultyId: facME1._id }),
        await Subject.create({ name: 'Manufacturing', code: 'ME-MFG', department: 'ME', semester: 3, facultyId: facME1._id })
    ];

    const meStudents = generateStudents('ME', 11, 'Mech');

    console.log('Seeding Large Volumes of Students...');
    // Array map execution for bulk inserts
    const allStudentDocs = [];
    
    for (const s of cseStudents) {
      allStudentDocs.push(await User.create({ ...s, password, role: 'student', department: 'CSE', semester: 3 }));
    }
    for (const s of eeStudents) {
      allStudentDocs.push(await User.create({ ...s, password, role: 'student', department: 'EE', semester: 3 }));
    }
    for (const s of meStudents) {
      allStudentDocs.push(await User.create({ ...s, password, role: 'student', department: 'ME', semester: 3 }));
    }

    console.log('Simulating Dense Subject-Level Attendance histories...');
    // Populate records separately per department constraint naturally
    const dates = [];
    for(let i=0; i<15; i++) { // Generate 15 days of strict attendance history
        const d = new Date(); d.setDate(d.getDate() - i); dates.push(d.toISOString().split('T')[0]);
    }

    const allSubjects = [...cseSubs, ...eeSubs, ...meSubs];
    let recCount = 0;
    
    for (const sub of allSubjects) {
        for (const date of dates) {
            // Only find students in the matching exact dept and semester matrix
            const matchingStudents = allStudentDocs.filter(stu => stu.department === sub.department && stu.semester === sub.semester);
            
            for (const student of matchingStudents) {
                const status = Math.random() > 0.15 ? 'Present' : 'Absent';
                await Attendance.create({
                    studentId: student._id,
                    subjectId: sub._id,
                    facultyId: sub.facultyId,
                    date: date,
                    status: status
                });
                recCount++;
            }
        }
    }

    console.log(`✅ Entire Gigantic University Structure Generated Successfully! (${recCount} attendance entries written)`);
    process.exit(0);
  } catch (err) {
    console.error('Seeding Error:', err);
    process.exit(1);
  }
};

seedDB();
